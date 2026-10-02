import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  // week 04: Import the createCategory and updateCategory functions
  createCategory,
  updateCategory,
  updateCategoryAssignments,
} from "../model/categories.js";
import { getProjectDetails } from "../model/projects.js";
import { body, validationResult } from "express-validator";

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Categories";
  res.render("categories", { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryDetails(categoryId);

  if (!category) {
    const error = new Error("Service category not found");
    error.status = 404;
    return next(error);
  }

  const projects = await getProjectsByCategoryId(categoryId);
  const title = "Service Category Details";
  res.render("category", { title, category, projects });
};

// week 04: Function to show the form for creating a new category
const showNewCategoryForm = (req, res) => {
  res.render("new-category", { title: "Create New Category" });
};

// week 04: Function to process the form submission for creating a new category
const processNewCategoryForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => req.flash("error", error.msg));
    return res.redirect("/new-category");
  }

  const categoryId = await createCategory(req.body.name);
  req.flash("success", "Category created successfully!");
  res.redirect(`/category/${categoryId}`);
};

// week 04: Function to show the form for editing an existing category
const showEditCategoryForm = async (req, res, next) => {
  const category = await getCategoryDetails(req.params.id);
  if (!category) {
    const error = new Error("Service category not found");
    error.status = 404;
    return next(error);
  }

  res.render("edit-category", { title: "Edit Category", category });
};

// week 04: Function to process the form submission for editing an existing category
const processEditCategoryForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => req.flash("error", error.msg));
    return res.redirect(`/edit-category/${req.params.id}`);
  }

  // Update the category in the database
  const updated = await updateCategory(req.params.id, req.body.name);
  if (!updated) {
    req.flash("error", "Service category not found");
    return res.redirect("/categories");
  }

  req.flash("success", "Category updated successfully!");
  res.redirect(`/category/${req.params.id}`);
};

// week 04: Validation rules for category forms
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters"),
];

const showAssignCategoryForm = async (req, res, next) => {
  const projectId = req.params.id;

  const projectDetails = await getProjectDetails(projectId);
  if (!projectDetails) {
    const error = new Error("Service project not found");
    error.status = 404;
    return next(error);
  }

  const categories = await getAllCategories();
  const title = "Assign Categories to Project";
  res.render("assign-category", {
    title,
    projectDetails,
    categories,
    projectId,
    assignedCategories: projectDetails.categories,
  });
};

const createAssignCategoryForm = async (req, res, next) => {
  const projectId = req.params.id;
  const categoryIds = req.body.categoryIds || [];

  const categoryIdsArray = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);

  req.flash("success", "Categories assigned to the project successfully!");
  res.redirect(`/project/${projectId}`);
};
export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
  showAssignCategoryForm,
  createAssignCategoryForm,
};
