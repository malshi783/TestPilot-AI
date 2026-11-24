const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

function toPublicUser(row) {
  return {
    user_id: row.user_id,
    full_name: row.full_name,
    email: row.email,
    role_id: row.role_id,
  };
}

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    { sub: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function registerUser(req, res, next) {
  try {
    const fullName = typeof req.body.full_name === "string"
      ? req.body.full_name.trim()
      : "";
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    const password = typeof req.body.password === "string"
      ? req.body.password
      : "";

    const validEmail = /^\S+@\S+\.\S+$/.test(email);
    const validName = fullName.length >= 2 && fullName.length <= 100;
    const validPassword = password.length >= 8
      && Buffer.byteLength(password, "utf8") <= 72;

    if (!validName || !validEmail || !validPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid name and email. Passwords must be at least 8 characters.",
      });
    }

    const roleResult = await pool.query(
      "SELECT role_id FROM roles WHERE role_name = $1 LIMIT 1",
      ["QA_ENGINEER"]
    );

    if (!roleResult.rows[0]) {
      return res.status(500).json({
        success: false,
        message: "Default QA role is missing. Run the database setup first.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const insertResult = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role_id)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, full_name, email, role_id`,
      [fullName, email, passwordHash, roleResult.rows[0].role_id]
    );

    const user = toPublicUser(insertResult.rows[0]);
    return res.status(201).json({
      success: true,
      user,
      token: createToken(user),
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    return next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    const password = typeof req.body.password === "string"
      ? req.body.password
      : "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter your email address and password.",
      });
    }

    const result = await pool.query(
      `SELECT user_id, full_name, email, role_id, password_hash
       FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    const row = result.rows[0];
    const passwordMatches = row
      ? await bcrypt.compare(password, row.password_hash)
      : false;

    if (!row || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect.",
      });
    }

    const user = toPublicUser(row);
    return res.json({
      success: true,
      user,
      token: createToken(user),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { registerUser, loginUser, toPublicUser };
