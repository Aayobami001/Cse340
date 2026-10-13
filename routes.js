import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
  showOrganizationsPage,
  processNewOrganizationForm,
} from "./controllers/organizations.js";
import {
  showProjectDetailsPage,
  volunteerForProject,
  removeProjectVolunteerSignup,
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

// Week 05: Import user registration and login controllers
import {
  showUserRegisterForm,
  processUserRegisterForm,
  showLoginForm,
  processLoginForm,
  showDashboard,
  requireRole,
  showRegisteredUsers,
  requireLogin,
} from "./controllers/users.js";


const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", requireLogin, showOrganizationsPage);
router.get("/projects", requireLogin, showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.post("/project/:id/volunteer", requireLogin, volunteerForProject);
router.post("/project/:id/unvolunteer", requireLogin, removeProjectVolunteerSignup);
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
router.post("/edit-project/:id", requireRole("admin"), projectValidation, processEditProjectForm);

// week 04: Routes for categories
router.get("/categories", requireLogin, showCategoriesPage);
router.get("/category/:id", requireLogin, showCategoryDetailsPage);
router.get("/new-category", requireRole("admin"), showNewCategoryForm);
router.post("/new-category", requireRole("admin"), categoryValidation, processNewCategoryForm);
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);
router.post("/edit-category/:id", requireRole("admin"), categoryValidation, processEditCategoryForm);

// Route for organization details page
router.get("/organization/:id", requireLogin, showOrganizationDetailsPage);

// Week 04: Route for new organization form
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);
// Route to handle new organization form submission
router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm,
);
// error-handling routes
router.get("/test-error", showTestErrorPage);
router.get("/edit-organization/:id", requireRole("admin"), showEditOrganizationForm);
router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);
// Week 04: Route for new project form
router.get("/new-project", requireRole("admin"), showNewProjectForm);
// Route to handle new project form submission
router.post("/new-project", requireRole("admin"), projectValidation, processNewProjectForm);
// Week 04: Route for assigning categories to a project
router.get("/assign-category/:id", requireRole("admin"), showAssignCategoryForm);
router.post("/assign-category/:id", requireRole("admin"), createAssignCategoryForm);

// Week 05: Routes for user registration and login
router.get("/register", showUserRegisterForm);
router.post("/register", processUserRegisterForm);
router.get("/login", showLoginForm); // Week 05: Route to show the login form
router.post("/login", processLoginForm);// week 05: Route to process the login form
// Week 05: Route for logging out the user
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});
// Week 05 Team Activity
router.get("/dashboard", showDashboard); // Dashboard is available to guests and logged-in users
router.post("/dashboard/projects/:id/unvolunteer", requireLogin, removeProjectVolunteerSignup);
router.get("/registered-users", requireRole("admin"), showRegisteredUsers); // Only admin can access registered users
export default router;
