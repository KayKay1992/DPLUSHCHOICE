import StarRating from "./StarRating";

const Product = () => {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-white/50 overflow-hidden">
      {/* Image Container */}
      <div className="relative h-80 w-full overflow-hidden rounded-t-3xl">
        <img
          src="/serum1.jpg"
          alt="Product 1"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {/* Luxury Badge */}
        <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          New
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-700 transition-colors duration-300">
          Elegant Plush Toy
        </h3>
        <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600 mb-4">
          ₦ 4,500
        </p>
        <div className="flex justify-center mb-4">
          <StarRating rating={4} starSize={24} />
        </div>
        {/* Add to Cart Button */}
        <button className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Product;
