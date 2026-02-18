import React from "react";
import { useState, useEffect } from "react";
import { FaPlus, FaImage, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const validateImageFile = (file) => {
  if (!file) return false;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    toast.error("Only JPG, PNG, WEBP or AVIF images are allowed.");
    return false;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    toast.error("Image must be 2MB or less.");
    return false;
  }
  return true;
};

const Banners = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [banners, setBanners] = useState([]);
  const [upLoading, setUploading] = useState("uploading is 0% complete");
  const [imagePreview, setImagePreview] = useState(null);

  const imageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateImageFile(file)) {
        e.target.value = "";
        setSelectedImage(null);
        setImagePreview(null);
        return;
      }

      setSelectedImage(file);
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedImage) {
      toast.error("Please select a banner image first.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a banner title.");
      return;
    }
    if (!bannerDescription.trim()) {
      toast.error("Please enter a banner description.");
      return;
    }

    if (!validateImageFile(selectedImage)) {
      return;
    }

    const data = new FormData();
    data.append("file", selectedImage);
    data.append(
      "folder",
      import.meta.env.VITE_CLOUDINARY_FOLDER || "dplushchoice/products"
    );
    data.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "uploads"
    );

    setUploading("uploading ...");
    try {
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwzdlml8c"
        }/image/upload`,
        data
      );
      const { url } = uploadRes.data;
      setUploading("Upload complete!");

      // Create banner with the uploaded image URL
      const bannerData = {
        title: title.trim(),
        subtitle: bannerDescription.trim(),
        image: url,
      };

      const res = await userRequest.post("/banners", bannerData);
      toast.success("Banner created successfully!");

      // Reset form
      setTitle("");
      setBannerDescription("");
      setSelectedImage(null);
      setImagePreview(null);
      setUploading("uploading is 0% complete");

      // Refresh banners list
      fetchBanners();
    } catch (error) {
      console.log(error);
      setUploading("Uploading failed. Please try again.");
      toast.error("Failed to create banner. Please try again.");
    }
  };

  // Fetch banners from database
  const fetchBanners = async () => {
    try {
      const res = await userRequest.get("/banners");
      setBanners(res.data);
    } catch (error) {
      console.log("Error fetching banners:", error);
      toast.error("Failed to load banners");
    }
  };

  // Delete banner
  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      await userRequest.delete(`/banners/${bannerId}`);
      toast.success("Banner deleted successfully!");
      fetchBanners(); // Refresh the list
    } catch (error) {
      console.log("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  // Load banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                Banners
              </h1>
              <p className="text-gray-200 mt-3 text-base sm:text-lg font-medium">
                Manage promotional banners and advertisements
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-pink-500/15 to-rose-500/10 border border-pink-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-200 text-sm font-semibold mb-1">
                  Total Banners
                </p>
                <p className="text-3xl font-bold text-white">
                  {banners.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-pink-500/30 to-rose-500/30 rounded-xl flex items-center justify-center border border-pink-400/30">
                <FaImage className="text-pink-300 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-500/15 to-emerald-500/10 border border-green-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-semibold mb-1">
                  Active Banners
                </p>
                <p className="text-3xl font-bold text-white">
                  {banners.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center border border-green-400/30">
                <FaEye className="text-green-300 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-yellow-500/15 to-orange-500/10 border border-yellow-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-semibold mb-1">
                  Inactive Banners
                </p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-xl flex items-center justify-center border border-yellow-400/30">
                <FaTrash className="text-yellow-300 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-500/15 to-cyan-500/10 border border-blue-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-semibold mb-1">
                  Views Today
                </p>
                <p className="text-3xl font-bold text-white">1,247</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-400/30">
                <span className="text-blue-300 text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-8">
          {/* Left - Active Banners */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Active Banners
              </h2>
              <div className="space-y-6">
                {banners.length > 0 ? (
                  banners.map((bannerItem) => (
                    <div
                      key={bannerItem._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <img
                          src={bannerItem.image}
                          alt={bannerItem.title}
                          className="w-20 h-20 object-cover rounded-xl shadow-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {bannerItem.title}
                          </h3>
                          <p className="text-gray-200 text-sm leading-relaxed">
                            {bannerItem.subtitle}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-400/30">
                            Active
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4 sm:mt-0">
                        <button
                          onClick={() => handleDeleteBanner(bannerItem._id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 p-2 rounded-xl transition-all duration-300 border border-red-400/30"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
                    <p className="text-gray-400">
                      No banners found. Create your first banner!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Add New Banner */}
          <div className="w-full lg:w-96">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Add New Banner
              </h2>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-pink-400/50 rounded-2xl p-8 text-center bg-white/10 hover:bg-white/15 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={imageChange}
                    className="hidden"
                    id="banner-image-upload"
                  />
                  <label
                    htmlFor="banner-image-upload"
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Banner preview"
                          className="w-24 h-24 object-cover rounded-xl mb-2 shadow-lg"
                        />
                      ) : (
                        <FaPlus className="text-pink-400 text-3xl mb-2" />
                      )}
                      <span className="text-gray-300">
                        {imagePreview
                          ? "Click to change image"
                          : "Click to upload banner image"}
                      </span>
                      {selectedImage && (
                        <span className="text-sm text-pink-300 mt-1">
                          {selectedImage.name}
                        </span>
                      )}
                    </div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter banner title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Banner Description
                  </label>
                  <textarea
                    placeholder="Enter banner description"
                    rows="4"
                    value={bannerDescription}
                    onChange={(e) => setBannerDescription(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
                  />
                </div>
                <div className="text-sm text-gray-300 mb-4">
                  Status: {upLoading}
                </div>
                <button
                  onClick={handleUpload}
                  className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={upLoading === "uploading ..."}
                >
                  {upLoading === "uploading ..."
                    ? "Uploading..."
                    : "Add Banner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners;
