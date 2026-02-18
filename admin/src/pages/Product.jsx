import { FaUpload } from "react-icons/fa";
import LineChart from "../components/LineChart";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";
import axios from "axios";

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

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    originalPrice: "",
    discountPrice: "",
    wholesalePrice: "",
    wholesaleMinimumQuantity: "",
    categories: [],
    inStock: true,
    stock: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState("Upload complete!");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await userRequest.get("/products/find/" + productId);
        setProduct(res.data);
        setFormData({
          title: res.data.title || "",
          desc: res.data.desc || "",
          originalPrice: res.data.originalPrice || "",
          discountPrice: res.data.discountPrice || "",
          wholesalePrice: res.data.wholesalePrice || "",
          wholesaleMinimumQuantity: res.data.wholesaleMinimumQuantity || "",
          categories: res.data.categories || [],
          inStock: res.data.inStock !== undefined ? res.data.inStock : true,
          stock: res.data.stock || "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to load product data!");
      }
    };
    getProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      categories: selectedCategories,
    }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!validateImageFile(selected)) {
      e.target.value = "";
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = product.img; // Keep existing image if no new file

      // Upload new image to Cloudinary if selected
      if (file) {
        if (!validateImageFile(file)) {
          setFile(null);
          return;
        }

        setUploading("uploading ...");

        const data = new FormData();
        data.append("file", file);
        data.append(
          "folder",
          import.meta.env.VITE_CLOUDINARY_FOLDER || "dplushchoice/products"
        );
        data.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "uploads"
        );

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwzdlml8c"
          }/image/upload`,
          data
        );
        imageUrl = uploadRes.data.url;
        setUploading("Upload complete!");
      }

      // Prepare product data
      const productData = {
        ...formData,
        img: imageUrl,
      };

      // Update product
      await userRequest.put(`/products/${productId}`, productData);

      toast.success("Product updated successfully!");
      // Navigate back to products page
      navigate("/products");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product!");
      setUploading("Upload failed. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-tr from-indigo-900 via-purple-900/40 to-pink-900/30 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                Product Details
              </h1>
              <p className="text-gray-200 mt-3 text-base sm:text-lg font-medium">
                View and manage product information
              </p>
            </div>
            <Link to="/new-product">
              <button className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                Create New
              </button>
            </Link>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Sales Analytics
            </h3>
            <div className="h-64">
              <LineChart />
            </div>
          </div>

          {/* Product Info Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Product Overview
            </h3>
            <div className="flex items-center gap-6 mb-6">
              <img
                className="w-24 h-24 object-cover rounded-2xl shadow-lg"
                src={
                  product.img
                    ? product.img.startsWith("http")
                      ? `${product.img}?t=${Date.now()}`
                      : `http://localhost:8000/${product.img}?t=${Date.now()}`
                    : "/placeholder.jpg"
                }
                alt="product"
              />
              <div>
                <h4 className="text-xl font-bold text-white mb-1">
                  {product.title}
                </h4>
                <span
                  className={`inline-block px-3 py-1 text-sm font-bold rounded-full border ${
                    product.inStock
                      ? "bg-green-500/20 text-green-300 border-green-400/30"
                      : "bg-red-500/20 text-red-300 border-red-400/30"
                  }`}
                >
                  {product.inStock ? "Active" : "Out of Stock"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-300 font-medium">Product ID:</span>
                <span className="text-white font-bold">{product._id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-300 font-medium">Total Sales:</span>
                <span className="text-white font-bold">
                  {product.totalSales}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-300 font-medium">Stock Level:</span>
                <span className="text-white font-bold">
                  {product.stock} units
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 lg:p-10">
          <h3 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-8">
            Edit Product Information
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Description
                </label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-3">
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-3">
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-3">
                    Wholesale Price
                  </label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    value={formData.wholesalePrice}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-3">
                    Wholesale Minimum Quantity
                  </label>
                  <input
                    type="number"
                    name="wholesaleMinimumQuantity"
                    value={formData.wholesaleMinimumQuantity}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Category
                </label>
                <select
                  multiple
                  name="categories"
                  value={formData.categories}
                  onChange={handleCategoryChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                >
                  <option value="" disabled selected className="bg-slate-800">
                    Select Category
                  </option>
                  <option value="perfumes" className="bg-slate-800">
                    Perfumes
                  </option>
                  <option value="body-sprays" className="bg-slate-800">
                    Body Sprays
                  </option>
                  <option value="diffusers" className="bg-slate-800">
                    Diffusers
                  </option>
                  <option value="scented-candles" className="bg-slate-800">
                    Scented Candles
                  </option>
                  <option value="necklace" className="bg-slate-800">
                    Necklace
                  </option>
                  <option value="earrings" className="bg-slate-800">
                    Earrings
                  </option>
                  <option value="rings" className="bg-slate-800">
                    Rings
                  </option>
                  <option value="wristwatches" className="bg-slate-800">
                    Wristwatches
                  </option>
                  <option value="anklets" className="bg-slate-800">
                    Anklets
                  </option>
                  <option value="bracelets" className="bg-slate-800">
                    Bracelets
                  </option>
                  <option value="bangles" className="bg-slate-800">
                    Bangles
                  </option>
                  <option value="bags" className="bg-slate-800">
                    Bags
                  </option>
                  <option value="clutch-purse" className="bg-slate-800">
                    Clutch Purse
                  </option>
                  <option value="jewelry-set" className="bg-slate-800">
                    Jewelry Set
                  </option>
                  <option value="other-accessories" className="bg-slate-800">
                    Other Accessories
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-3">
                    In Stock
                  </label>
                  <select
                    name="inStock"
                    value={formData.inStock.toString()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        inStock: e.target.value === "true",
                      }))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  >
                    <option value="true" className="bg-slate-800">
                      Yes
                    </option>
                    <option value="false" className="bg-slate-800">
                      No
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-3">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-dashed border-pink-400/50 flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : product.img
                        ? product.img.startsWith("http")
                          ? `${product.img}?t=${Date.now()}`
                          : `http://localhost:8000/${
                              product.img
                            }?t=${Date.now()}`
                        : "/placeholder.jpg"
                    }
                    alt="product"
                  />
                </div>
                <label className="inline-block cursor-pointer">
                  <div className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center space-x-2">
                    <FaUpload className="text-sm" />
                    <span>Upload New Image</span>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="w-full max-w-xs">
                <button className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                  Update Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Product;
