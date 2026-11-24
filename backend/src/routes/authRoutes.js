const express = require("express");
const pool = require("../config/database");
const { loginUser, registerUser } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT user_id, full_name, email, role_id
       FROM users WHERE user_id = $1 LIMIT 1`,
      [req.user.user_id]
    );

    if (!result.rows[0]) {
      return res.status(401).json({
        success: false,
        message: "Account no longer exists. Please register again.",
      });
    }

    return res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
