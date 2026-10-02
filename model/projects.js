import db from "./db.js";
import "dotenv/config.js";

const getAllProjects = async () => {
  const query = `
        SELECT
          service_project.service_project_id,
          service_project.title,
          service_project.description,
          service_project.location,
          service_project.date_begin,
          service_project.organization_id,
          organization.name AS organization_name
        FROM public.service_project
        LEFT JOIN public.organization
          ON organization.organization_id = service_project.organization_id
        ORDER BY service_project.date_begin ASC;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      service_project.service_project_id,
      service_project.title,
      service_project.description,
      service_project.location,
      service_project.date_begin,
      service_project.organization_id,
      organization.name
    FROM public.service_project
    JOIN public.organization 
      ON service_project.organization_id = organization.organization_id
    WHERE service_project.date_begin >= CURRENT_DATE
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
        SELECT
          service_project.service_project_id AS project_id,
          service_project.title,
          service_project.description,
          service_project.date_begin AS date,
          service_project.location,
          service_project.organization_id,
          organization.name AS organization_name
        FROM public.service_project
        INNER JOIN public.organization
          ON organization.organization_id = service_project.organization_id
        WHERE service_project.service_project_id = $1;
    `;

  const result = await db.query(query, [projectId]);

  if (result.rows.length === 0) {
    return null;
  }

  const categoriesQuery = `
    SELECT category.category_id, category.name
    FROM public.category
    INNER JOIN public.service_project_category
      ON category.category_id = service_project_category.category_id
    WHERE service_project_category.service_project_id = $1
    ORDER BY category.name;
  `;

  const categoriesResult = await db.query(categoriesQuery, [projectId]);

  return { ...result.rows[0], categories: categoriesResult.rows };
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          service_project_id,
          title,
          description,
          location,
          date_begin
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY date_begin;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

// Week 04: Function to create a new project in the database 
const createProject = async (title, description, location, date_begin, organizationId) => {
  const query = `
    INSERT INTO service_project (title, description, location, date_begin, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING service_project_id;
  `;
  const queryParams = [title, description, location, date_begin, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }             
  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].service_project_id);
  }

  return result.rows[0].service_project_id;
};

export {
  getAllProjects,
  getProjectDetails,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  createProject,
};
