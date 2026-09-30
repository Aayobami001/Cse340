import db from './db.js'
import 'dotenv/config.js'

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
          service_project.service_project_id,
          service_project.title
        FROM public.service_project
        INNER JOIN public.service_project_category
          ON service_project.service_project_id = service_project_category.service_project_id
        WHERE service_project_category.category_id = $1
        ORDER BY service_project.date_begin ASC;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

export { getAllCategories, getCategoryDetails, getProjectsByCategoryId };
