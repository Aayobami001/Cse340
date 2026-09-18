// Import the testConnection function from the db.js file (WEEK TWO)
import { testConnection } from "./model/db.js";
import { getAllOrganizations } from "./model/organizations.js";
import { getAllprojects } from "./model/projects.js";


import "dotenv/config";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const app = express();

/**
  Configure Express middleware
*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes
 */
app.get("/", async (req, res) => {
  const title = "Home";
  res.render("home", { title });
});

app.get("/organizations", async (req, res) => {
  // added the getAllOrganizations function to retrieve the organizations from the database wk 02
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";
  res.render("organizations", {title, organizations }); 
});

app.get("/projects", async (req, res) => {
  // added the getAllprojects function to retrieve the projects from the database wk 02
  const projects = await getAllprojects();
  const title = "Service Projects";
  res.render("projects", {title, projects });
});

app.get("/categories", async (req, res) => {
  const title = "Service Categories";
  res.render("categories", { title });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});