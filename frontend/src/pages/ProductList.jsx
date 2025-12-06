import React, { useState, useEffect } from "react";
import Products from "../components/Products";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Product categories based on Category.jsx file
  const categories = [
    { value: "all", label: "All Products" },
    { value: "perfumes", label: "Perfumes" },
    { value: "body-sprays", label: "Body Sprays" },
    { value: "diffusers", label: "Diffusers" },
    { value: "scented-candles", label: "Scented Candles" },
    { value: "necklace", label: "Necklace" },
    { value: "earrings", label: "Earrings" },
    { value: "rings", label: "Rings" },
    { value: "wristwatches", label: "Wristwatches" },
    { value: "anklets", label: "Anklets" },
    { value: "bracelets", label: "Bracelets" },
    { value: "bangles", label: "Bangles" },
    { value: "bags", label: "Bags" },
    { value: "clutch-purse", label: "Clutch Purse" },
    { value: "jewelry-set", label: "Jewelry Set" },
    { value: "other-accessories", label: "Other Accessories" },
  ];

  // Sorting options
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
  ];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-4">
              Our Product Collection
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              Discover our exquisite collection of plush toys and luxury items,
              carefully curated for your comfort and delight.
            </p>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-800 whitespace-nowrap">
                  Filter by:
                </span>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 font-medium min-w-[200px]"
                  name="category"
                  id="category-select"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-800 whitespace-nowrap">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 font-medium min-w-[200px]"
                  name="sort"
                  id="sort-select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-medium">
              Showing{" "}
              {selectedCategory === "all"
                ? "all products"
                : `${selectedCategory.replace("-", " ")} category`}
              {sortBy !== "featured" &&
                ` • Sorted by ${sortOptions
                  .find((opt) => opt.value === sortBy)
                  ?.label.toLowerCase()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <Products selectedCategory={selectedCategory} sortBy={sortBy} />
    </div>
  );
};

export default ProductList;
