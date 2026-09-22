// Import the testConnection function from the db.js file (WEEK TWO)
import { testConnection } from "./model/db.js";
import router from "./routes.js";
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
  View Engine Setup:
*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// week 3: Added middleware to log all incoming requests and make NODE_ENV available to templates
// Middleware to log all incoming requests

app.use((req, res, next) => {
  if (NODE_ENV === "development") {
    console.log(`${req.method} ${req.url}`);
  }
  next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

/**
 * Routes
 * 
 * Use the imported router for handling routes. The router is defined in routes.js and contains all the route definitions for the application.
 */
app.use(router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error details for debugging
  console.error("Error occurred:", err.message);
  console.error("Stack trace:", err.stack);

  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  // Prepare data for the template
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: err.stack,
  };

  // Render the appropriate error template
  res.status(status).render(`errors/${template}`, context);
});
// week 3: Ends here


app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
