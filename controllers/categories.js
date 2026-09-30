import { getAllCategories, getCategoryDetails } from "../model/categories.js";

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Categories";
  res.render("categories", { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
  const category = await getCategoryDetails(req.params.id);

  if (!category) {
    const error = new Error("Service category not found");
    error.status = 404;
    return next(error);
  }

  const title = "Service Category Details";
  res.render("category", { title, category });
};

export { showCategoriesPage, showCategoryDetailsPage };
