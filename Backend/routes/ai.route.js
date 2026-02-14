import express from "express";
import multer from "multer";
import {
  generateDescription,
  productHelperChat,
} from "../controller/ai.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/description", upload.single("image"), generateDescription);
router.post("/chat", productHelperChat);

export default router;
