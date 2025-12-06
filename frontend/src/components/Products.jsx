import React, { useState, useEffect } from "react";
import Product from "./Product";

const Products = ({ selectedCategory = "all", sortBy = "featured" }) => {
  // Sample product data - in a real app, this would come from an API
  const [allProducts] = useState([
    {
      id: 1,
      img: "/lotion.jpg",
      name: "Luxury Teddy Bear",
      price: 4500,
      category: "teddy-bears",
      rating: 4.5,
      isNew: true,
      isPopular: true,
    },
    {
      id: 2,
      img: "/lotion1.jpg",
      name: "Plush Panda",
      price: 5200,
      category: "plush-animals",
      rating: 4.8,
      isNew: false,
      isPopular: true,
    },
    {
      id: 3,
      img: "/lotion2.jpg",
      name: "Elegant Rabbit",
      price: 3800,
      category: "plush-animals",
      rating: 4.2,
      isNew: true,
      isPopular: false,
    },
    {
      id: 4,
      img: "/serum1.jpg",
      name: "Luxury Pillow Set",
      price: 8500,
      category: "luxury-pillows",
      rating: 4.7,
      isNew: false,
      isPopular: true,
    },
    {
      id: 5,
      img: "/lotion3.jpg",
      name: "Decorative Unicorn",
      price: 6200,
      category: "decorative-items",
      rating: 4.3,
      isNew: true,
      isPopular: false,
    },
    {
      id: 6,
      img: "/lotion.jpg",
      name: "Gift Set Bundle",
      price: 12000,
      category: "gift-sets",
      rating: 4.9,
      isNew: false,
      isPopular: true,
    },
    {
      id: 7,
      img: "/lotion1.jpg",
      name: "Seasonal Reindeer",
      price: 4800,
      category: "seasonal",
      rating: 4.4,
      isNew: true,
      isPopular: false,
    },
    {
      id: 8,
      img: "/lotion2.jpg",
      name: "Custom Plush Order",
      price: 15000,
      category: "custom",
      rating: 5.0,
      isNew: false,
      isPopular: false,
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Filter and sort products based on selected criteria
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      case "featured":
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, allProducts]);

  return (
    <section className="py-16 px-4 bg-linear-to-b from-pink-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredProducts.map((product) => (
              <Product
                key={product.id}
                img={product.img}
                name={product.name}
                price={product.price}
                category={product.category}
                rating={product.rating}
                isNew={product.isNew}
                isPopular={product.isPopular}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/30 max-w-md mx-auto">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching your current filters.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Reset Filters
              </button>
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
