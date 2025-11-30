import Banner from "../models/banner.model.js";
import asyncHandler from "express-async-handler";

//create banner
export const createBanner = asyncHandler(async (req, res) => {
  const newBanner = await new Banner(req.body);
  const banner = await newBanner.save();

  if (banner) {
    res.status(201).json({
      message: "Banner created successfully",
      banner,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong while creating banner");
  }
});

//Delete Banner
export const deleteBanner = asyncHandler(async (req, res) => {
  const deletedBanner = await Banner.findByIdAndDelete(req.params.id);

  if (deletedBanner) {
    res.status(200).json({
      message: "Banner deleted successfully",
    });
  } else {
    res.status(404);
    throw new Error("Something went wrong while deleting banner");
  }
});


//Get All Banners
export const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();

  if (banners) {
    res.status(200).json(banners);
  } else {
    res.status(404);
    throw new Error("Something went wrong while fetching banners");
  }
});

//Get Random Banner 
export const getRandomBanner = asyncHandler(async (req, res) => {
  const banners = await Banner.find();

  if (banners) {
    const randomIndex = Math.floor(Math.random() * banners.length);
    const randomBanner = banners[randomIndex];
    res.status(200).json(randomBanner);
  } else {
    res.status(404);
    throw new Error("Something went wrong while fetching random banner");
  }
});

