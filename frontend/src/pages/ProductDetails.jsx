import { FaMinus, FaPlus } from "react-icons/fa";
import StarRating from "../components/StarRating";

const ProductDetails = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Product Images and Gallery */}
          <div className="lg:w-1/2 p-8">
            <div className="relative">
              <img
                src="/lotion2.jpg"
                alt="Elegant Plush Toy"
                className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
          {/* Right Side - Product Info, Reviews, and Purchase Options */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                {/* Placeholder for brand */}
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  Brand Name
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Elegant Plush Toy
                </h1>
                {/* Placeholder for categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                    Perfume
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                    Diffuser
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  Indulge in the ultimate luxury with our Elegant Plush Toy,
                  crafted from the finest materials to provide unparalleled
                  comfort and style. Perfect for adding a touch of
                  sophistication to any space. Experience the plush softness and
                  exquisite design that defines true elegance.
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <StarRating rating={4} starSize={24} />
                  <span className="ml-2 text-gray-600">(2 reviews)</span>
                </div>
                {/* Placeholder for skin type and concern */}
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Skin Type:</strong> All Skin Types
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Concern:</strong> Hydration
                </p>
                <div className="flex items-center mb-4">
                  {/* Placeholder for discount */}
                  <span className="text-lg text-gray-500 line-through mr-4">
                    ₦ 5,000
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">
                    ₦ 4,500
                  </h2>
                </div>
                <p className="text-sm text-gray-600">In Stock (50 available)</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-6 mb-6">
                <h2 className="flex items-center justify-center font-semibold text-lg text-gray-700 mb-4">
                  WHAT'S IN THE BOX
                </h2>
                <hr className="mb-4" />
                <ul className="text-gray-600 space-y-1">
                  <li>• 1x Elegant Plush Toy</li>
                  <li>• 1x Care Instructions</li>
                  <li>• 1x Gift Box Packaging</li>
                </ul>
              </div>
              <div className="inline-flex items-center bg-linear-to-r from-pink-400 to-purple-400 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md mb-6">
                Wholesale Price: ₦ 4,000 per unit (min. 10 units)
              </div>
              <div className="flex items-center mb-6">
                <button className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  <FaMinus />
                </button>
                <span className="text-lg font-semibold mx-4 px-4 py-2 bg-gray-100 rounded-lg">
                  1
                </span>
                <button className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  <FaPlus />
                </button>
              </div>
              <button className="w-full lg:w-3/4 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-8">
                Add to Cart
              </button>
            </div>

            <div>
              <hr className="my-6" />
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Customer Reviews
                </h2>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      John Doe
                    </span>
                    <StarRating rating={4} starSize={16} />
                  </div>
                  <p className="text-gray-700">
                    Great product! Highly recommended.
                  </p>
                </div>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Frank</span>
                    <StarRating rating={5} starSize={16} />
                  </div>
                  <p className="text-gray-700">
                    Excellent quality and customer service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
