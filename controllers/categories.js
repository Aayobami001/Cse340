import { getAllCategories, getCategoryDetails, getProjectsByCategoryId } from "../model/categories.js";

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

export { showCategoriesPage, showCategoryDetailsPage };
