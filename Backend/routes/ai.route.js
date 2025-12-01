import express from "express";
import multer from "multer";
import { generateDescription } from "../controller/ai.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/description",
  protect,
  upload.single("image"),
  generateDescription
);

export default router;
