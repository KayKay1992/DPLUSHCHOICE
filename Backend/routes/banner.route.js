import express from "express";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getRandomBanner,
} from "../controller/banner.controller.js";
const router = express.Router();

//CREATE BANNER ROUTE
router.post("/", createBanner);

//DELETE BANNER ROUTE
router.delete("/:id", deleteBanner);

//GET ALL BANNERS ROUTE
router.get("/", getAllBanners);

//GET RANDOM BANNER ROUTE
router.get("/random", getRandomBanner);

export default router;