import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProd =
    String(process.env.NODE_ENV || "").toLowerCase() === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProd,
    // Use None in production to support separate frontend/backend domains.
    // In dev (localhost), lax is fine and works over http.
    sameSite: isProd ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};
export default generateToken;
