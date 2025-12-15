import React, { useState, useEffect } from "react";
import Product from "./Product";
import { userRequest } from "../requestMethods";

const Products = ({ filters, sortBy, selectedCategory, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        let url = "/products";
        if (searchTerm && searchTerm !== "all") {
          url += `?search=${encodeURIComponent(searchTerm)}`;
        }
        const res = await userRequest.get(url);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, [searchTerm]);

  // Filter and sort products based on selected criteria
  useEffect(() => {
    let filtered = [...products];

    // Apply filters (if any additional filters are passed)
    if (filters) {
      filtered = filtered.filter((product) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value || value === "all") return true;

          // Handle different filter types
          if (key === "priceRange") {
            const [min, max] = value.split("-").map(Number);
            return product.discountPrice >= min && product.discountPrice <= max;
          }

          if (key === "rating") {
            return product.rating >= Number(value);
          }

          // For array fields like categories
          if (Array.isArray(product[key])) {
            return product[key].includes(value);
          }

          // For string fields
          return product[key] === value;
        });
      });
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.categories && product.categories.includes(selectedCategory)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            (a.discountPrice || a.originalPrice || 0) -
            (b.discountPrice || b.originalPrice || 0)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            (b.discountPrice || b.originalPrice || 0) -
            (a.discountPrice || a.originalPrice || 0)
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "name":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "featured":
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, sortBy, products, selectedCategory]);

  return (
    <section className="py-16 px-4 bg-linear-to-b from-pink-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Search Results Header */}
        {searchTerm && searchTerm !== "all" && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Search Results for "{searchTerm}"
            </h2>
            <p className="text-gray-600">
              Found {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredProducts.map((product) => (
              <Product
                key={product._id}
                productId={product._id}
                img={
                  product.img
                    ? product.img.startsWith("http")
                      ? product.img
                      : `http://localhost:8000/${product.img}`
                    : "/placeholder.jpg"
                }
                name={product.title}
                price={product.discountPrice || product.originalPrice}
                originalPrice={product.originalPrice}
                category={
                  product.categories ? product.categories[0] : "general"
                }
                rating={4.5} // Default rating since API doesn't have this
                isNew={
                  product.createdAt
                    ? new Date() - new Date(product.createdAt) <
                      30 * 24 * 60 * 60 * 1000
                    : false
                } // New if created within 30 days
                isPopular={product.totalSales ? product.totalSales > 10 : false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/30 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {searchTerm && searchTerm !== "all"
                  ? `No products found for "${searchTerm}"`
                  : "No Products Found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm && searchTerm !== "all"
                  ? "Try adjusting your search terms or browse our full catalog."
                  : "We're working on adding more amazing products to our collection."}
              </p>
              {searchTerm && searchTerm !== "all" && (
                <button
                  onClick={() => (window.location.href = "/products")}
                  className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors font-semibold"
                >
                  Browse All Products
                </button>
              )}
            </div>
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-400 text-pink-600 hover:text-pink-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
