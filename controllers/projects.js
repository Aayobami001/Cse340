import { getProjectDetails, getAllProjects, getUpcomingProjects } from "../model/projects.js";

const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects(5); // Fetch 10 projects
  // const projects = await getUpcomingProjects(10); // Fetch 5 upcoming projects
  const title = "Upcoming Service Projects";
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

export { showProjectDetailsPage, showProjectsPage, };
