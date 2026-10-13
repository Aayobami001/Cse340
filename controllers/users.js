import bcrypt from "bcrypt";
import { createUser, getRegisterUser } from "../model/users.js";
import { authenticateUser } from "../model/users.js";
import { getVolunteerProjects } from "../model/projects.js";

const saltRounds = 10;
const password = "user-password";

const showUserRegisterForm = (req, res) => {
  res.render("register", { title: "Register" });
};

const processUserRegisterForm = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const userId = await createUser(name, email, hashedPassword);

    // Redirect to the login page after successful registration
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/login");
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    req.flash(
      "error",
      "An error occurred while registering. Please try again.",
    );
    res.redirect("/register");
  }
};

const showLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);

  try {
    if (user) {
      // Authentication successful
      req.session.user = user;
      req.flash("success", "Login successful!");
      if (res.locals.NODE_ENV === "development") {
        console.log("User logged in:", user);
      }
      res.redirect("/dashboard");
    } else {
      // Authentication failed
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
};

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }
  next();
};

// Week 05
const showDashboard = async (req, res) => {
  const user = req.session?.user;
  const volunteerProjects = user
    ? await getVolunteerProjects(user.user_id)
    : [];
  res.render("dashboard", {
    title: "Dashboard",
    user,
    volunteerProjects,
  });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 * 
 * There was nothing wrong with the original code but it did not work, and i dont know why
 * But the example they gave work and they are the same codes 
 * const requireRole = (role) => {
    return (res, req, next) => {
        // Checking if user is logged in
        if (!req.session || !req.session.user) {
            req.flash("error", "You must logged in to access this page");
            return res.redirect("/login");
        }

        if (req.session.user.role_name !== role) {
            req.flash("error", "You do not have access/permission to this page");
            return res.redirect("/");
        }

        // user has required role, continue
        next();
    };
};
 * 
 */
const requireRole = (role) => {
  return (req, res, next) => {
    // Check if user is logged in first
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    // Check if user's role matches the required role
    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/");
    }

    // User has required role, continue
    next();
  };
};

const showRegisteredUsers = async (req, res) => {
  const user = await getRegisterUser();
  res.render("registered-users", {
    title: "Registered Users",
    user,
  });
};

export {
  showUserRegisterForm,
  processUserRegisterForm,
  showLoginForm,
  processLoginForm,
  requireLogin,
  showDashboard,
  requireRole,
  showRegisteredUsers,
};
