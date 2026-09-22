import { getAllProjects } from "../model/projects.js";

const showProjectsPage = async (req, res) => {
  // added the getAllprojects function to retrieve the projects from the database wk 02
// Added controller function in week 03
  const projects = await getAllProjects();
  const title = "Service Projects";
  res.render("projects", { title, projects });
};

export { showProjectsPage };
