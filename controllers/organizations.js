import { getAllOrganizations } from "../model/organizations.js";

const showOrganizationsPage = async (req, res) => {
  // added the getAllOrganizations function to retrieve the organizations from the database wk 02
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";
  res.render("organizations", { title, organizations });
};

export { showOrganizationsPage };
