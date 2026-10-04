import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
  showOrganizationsPage,
  processNewOrganizationForm,
} from "./controllers/organizations.js";
import {
  showProjectDetailsPage,
  showProjectsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
} from "./controllers/projects.js";
import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
  showAssignCategoryForm,
  createAssignCategoryForm,
} from "./controllers/categories.js";
import { showTestErrorPage } from "./controllers/errors.js";
import {
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/edit-project/:id", showEditProjectForm);
router.post("/edit-project/:id", projectValidation, processEditProjectForm);

// week 04: Routes for categories
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetailsPage);
router.get("/new-category", showNewCategoryForm);
router.post("/new-category", categoryValidation, processNewCategoryForm);
router.get("/edit-category/:id", showEditCategoryForm);
router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);

// Route for organization details page
router.get("/organization/:id", showOrganizationDetailsPage);

// Week 04: Route for new organization form
router.get("/new-organization", showNewOrganizationForm);
// Route to handle new organization form submission
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);
// error-handling routes
router.get("/test-error", showTestErrorPage);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post(
  "/edit-organization/:id",
  organizationValidation,
  processEditOrganizationForm,
);
// Week 04: Route for new project form
router.get("/new-project", showNewProjectForm);
// Route to handle new project form submission
router.post("/new-project", projectValidation, processNewProjectForm);
// Week 04: Route for assigning categories to a project
router.get("/assign-category/:id", showAssignCategoryForm);
router.post("/assign-category/:id", createAssignCategoryForm);

export default router;
