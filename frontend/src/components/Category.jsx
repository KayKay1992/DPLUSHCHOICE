import React from "react";

const categories = [
  { name: "Perfumes", image: "/perfume.jpg" },
  { name: "Body Sprays", image: "/body spray.jpg" },
  { name: "Diffusers", image: "/diffusers.jpg" },
  { name: "Scented Candles", image: "/scented candles.jpg" },
  { name: "Necklace", image: "/Necklace.jpg" },
  { name: "Earrings", image: "/earring.jpg" },
  { name: "Rings", image: "/rings.avif" },
  { name: "Wristwatches", image: "/wristwatch.jpg" },
  { name: "Anklets", image: "/anklets.jpg" },
  { name: "Bracelets", image: "/bracelets.jpg" },
  { name: "Bangles", image: "/bangles.jpg" },
  { name: "Bags", image: "/bags.jpg" },
  { name: "Clutch Purse", image: "/clutch purse.jpg" },
  { name: "Jewelry Set", image: "/jewery set.jpg" },
  { name: "Other accessories", image: "/product1.png" },
];

const Category = () => {
  return (
    <section className="py-16 px-4 bg-linear-to-b from-pink-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Fancy Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="mt-4 text-lg text-gray-600 font-medium">
            Discover luxury in every detail
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <div
              key={cat.name}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              // Staggered fade-in animation
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Image Container */}
              <div className="aspect-w-1 aspect-h-1 relative h-64 md:h-72">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Sparkling Border Effect */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-pink-400/50 group-hover:ring-offset-4 group-hover:ring-offset-transparent transition-all duration-500" />

                {/* Category Name */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-2xl">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-pink-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Explore Collection →
                  </p>
                </div>

                {/* Subtle Shine Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -translate-y-10 group-hover:translate-y-0 transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Optional CTA at bottom */}
        <div className="text-center mt-16">
          <button className="px-10 py-4 bg-linear-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Category;