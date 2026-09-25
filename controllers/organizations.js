import { getAllOrganizations, getOrganizationDetails } from "../model/organizations.js";
import { getProjectsByOrganizationId } from "../model/projects.js";

const showOrganizationsPage = async (req, res) => {
  // added the getAllOrganizations function to retrieve the organizations from the database wk 02
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";
  res.render("organizations", { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

export { showOrganizationsPage, showOrganizationDetailsPage };
