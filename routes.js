import express from "express";

import { showHomePage } from "./controllers/index.js";
import { showOrganizationsPage, processNewOrganizationForm } from "./controllers/organizations.js";
import {
  showProjectDetailsPage,
  showProjectsPage,
} from "./controllers/projects.js";
import {
  showCategoriesPage,
  showCategoryDetailsPage,
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
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetailsPage);
// Route for organization details page
router.get("/organization/:id", showOrganizationDetailsPage);

// Week 04: Route for new organization form
router.get("/new-organization", showNewOrganizationForm);
// Route to handle new organization form submission
router.post("/new-organization", organizationValidation, processNewOrganizationForm);
// error-handling routes
router.get("/test-error", showTestErrorPage);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post("/edit-organization/:id", organizationValidation, processEditOrganizationForm);

export default router;
