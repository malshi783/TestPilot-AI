const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.get("authorization") || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Sign in to continue.",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({
      success: false,
      message: "Authentication is not configured on the server.",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(401).json({
        success: false,
        message: "Invalid session. Please sign in again.",
      });
    }

    req.user = {
      user_id: userId,
      email: payload.email,
    };

    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Your session has expired. Please sign in again.",
    });
  }
}

module.exports = { requireAuth };
