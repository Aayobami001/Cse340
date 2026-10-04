import {
  getProjectDetails,
  getAllProjects,
  createProject,
  updateProject,
} from "../model/projects.js";
import { getAllOrganizations } from "../model/organizations.js";
import { body, validationResult } from "express-validator";

const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = "Service Projects";
  res.render("projects", { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
  const project = await getProjectDetails(req.params.id);

  if (!project) {
    const error = new Error("Service project not found");
    error.status = 404;
    return next(error);
  }

  const title = "Service Project Details";
  res.render("project", { title, project });
};

// week 04: New function to show the form for creating a new project
const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Add New Project";
  res.render("new-project", { title, organizations });
};

const processNewProjectForm = async (req, res) => {
  const { title, description, location, date_begin, organizationId } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // validation failed - loop through errors
      errors.array().forEach((error) => {
        req.flash("error", error.msg);
      });
      // Re-render the form back to new-project
      return res.redirect(`/new-project`);
    }

    // create a new project in the database
    const newProjectId = await createProject(
      title,
      description,
      location,
      date_begin,
      organizationId,
    );

    req.flash("success", "New service project created successfully!");
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error("Error creating new project:", error);
    req.flash(
      "error",
      "An error occurred while creating the new service project.",
    );
    res.redirect("/new-project");
  }
};

// week 04: New function to show the form for editing an existing project
const showEditProjectForm = async (req, res, next) => {
  const [project, organizations] = await Promise.all([
    getProjectDetails(req.params.id),
    getAllOrganizations(),
  ]);

  if (!project) {
    const error = new Error("Service project not found");
    error.status = 404;
    return next(error);
  }

  res.render("edit-project", {
    title: "Edit Project Information",
    project,
    organizations,
  });
};

const processEditProjectForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => req.flash("error", error.msg));
    return res.redirect(`/edit-project/${req.params.id}`);
  }

  const { title, description, location, date, organizationId } = req.body;
  const updated = await updateProject(
    req.params.id,
    title,
    description,
    location,
    date,
    organizationId,
  );

  if (!updated) {
    req.flash("error", "Service project not found");
    return res.redirect("/projects");
  }

  req.flash("success", "Project information updated successfully!");
  res.redirect(`/project/${req.params.id}`);
};

// week 04: Validation rules for the new project form
const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location must be less than 200 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date format"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];

export {
  showProjectDetailsPage,
  showProjectsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
};
