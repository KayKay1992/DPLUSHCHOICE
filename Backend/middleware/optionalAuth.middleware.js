import jwt from "jsonwebtoken";

/**
 * Optional auth middleware.
 * - If a valid JWT cookie is present, attaches req.user
 * - If not present/invalid, continues without blocking
 */
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    // Do not block requests if token is invalid/expired
    return next();
  }
};

export default optionalAuth;
