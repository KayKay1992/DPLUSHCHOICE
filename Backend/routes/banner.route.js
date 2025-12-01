import express from "express";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getRandomBanner,
} from "../controller/banner.controller.js";
import protect from "../middleware/auth.middleware.js";
const router = express.Router();

//CREATE BANNER ROUTE
router.post("/", protect, createBanner);

//DELETE BANNER ROUTE
router.delete("/:id", protect, deleteBanner);

//GET ALL BANNERS ROUTE
router.get("/", getAllBanners);

//GET RANDOM BANNER ROUTE
router.get("/random", getRandomBanner);

export default router;
