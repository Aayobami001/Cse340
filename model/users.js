import db from "./db.js";
import "dotenv/config.js";
import bcrypt from "bcrypt";

// Week 05: User model functions for creating and finding users
const default_role = "user"; // Default role for new users

const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO public.users (name, email, password_hash, role_id)
    VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
    RETURNING user_id
  `;
  const queryParams = [name, email, passwordHash, default_role];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create user");
  }
  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created a new user with ID:", result.rows[0].user_id);
  }

  return result.rows[0].user_id;
};

// Week 05: Function to find a user by email
const findUserByEmail = async (email) => {
  const query = `
        SELECT u.user_id, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
  const queryParams = [email];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    return null; // User not found
  }

  return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
  const isMatch = await bcrypt.compare(password, passwordHash);
  return isMatch;
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null; // User not found
  }

  const isMatch = await verifyPassword(password, user.password_hash);

  if (!isMatch) {
    return null; // Incorrect password
  }

  return user; // Authentication successful
};

const getRegisterUser = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
    `;
    const result = await db.query(query);
    return result.rows;
};

export { createUser, authenticateUser, getRegisterUser };
