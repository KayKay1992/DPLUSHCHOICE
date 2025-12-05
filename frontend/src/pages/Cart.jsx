import { FaMinus, FaPlus, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Go Back Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white text-pink-600 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <FaArrowLeft className="text-base sm:text-lg" />
            <span className="text-sm sm:text-base">Go Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600 text-center">
            Your Shopping Cart
          </h1>
          <div className="hidden sm:block w-32"></div>{" "}
          {/* Spacer for centering on larger screens */}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Side - Cart Items */}
          <div className="flex-1 bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Items in Cart (3)
              </h2>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 sm:px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                Clear All
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Cart Item 1 */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <img
                      src="/lotion.jpg"
                      alt="Product 1"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                        Product Name
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Description
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-100 rounded-full p-1 w-full sm:w-auto justify-center">
                      <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                        <FaMinus className="text-xs sm:text-sm" />
                      </button>
                      <span className="text-base sm:text-lg font-bold mx-3 sm:mx-4 px-2 sm:px-3 py-1 bg-white rounded-full shadow-sm min-w-8 text-center">
                        1
                      </span>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                        <FaPlus className="text-xs sm:text-sm" />
                      </button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-2">
                      <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-purple-600">
                          ₦ 4,500
                        </p>
                      </div>
                      <button className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all duration-300 self-end">
                        <FaTrashAlt className="text-lg sm:text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Item 2 */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <img
                      src="/lotion2.jpg"
                      alt="Product 2"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                        Luxury Perfume
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Elegant fragrance with floral notes
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-100 rounded-full p-1 w-full sm:w-auto justify-center">
                      <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                        <FaMinus className="text-xs sm:text-sm" />
                      </button>
                      <span className="text-base sm:text-lg font-bold mx-3 sm:mx-4 px-2 sm:px-3 py-1 bg-white rounded-full shadow-sm min-w-8 text-center">
                        2
                      </span>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                        <FaPlus className="text-xs sm:text-sm" />
                      </button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-2">
                      <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-purple-600">
                          ₦ 8,500
                        </p>
                      </div>
                      <button className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all duration-300 self-end">
                        <FaTrashAlt className="text-lg sm:text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Item 3 */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <img
                      src="/logo.jpg"
                      alt="Product 3"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                        Plush Teddy Bear
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Soft and cuddly companion for all ages
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-100 rounded-full p-1 w-full sm:w-auto justify-center">
                      <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                        <FaMinus className="text-xs sm:text-sm" />
                      </button>
                      <span className="text-base sm:text-lg font-bold mx-3 sm:mx-4 px-2 sm:px-3 py-1 bg-white rounded-full shadow-sm min-w-8 text-center">
                        1
                      </span>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                        <FaPlus className="text-xs sm:text-sm" />
                      </button>
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-2">
                      <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-purple-600">
                          ₦ 6,200
                        </p>
                      </div>
                      <button className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all duration-300 self-end">
                        <FaTrashAlt className="text-lg sm:text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:w-96 bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 h-fit w-full">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Order Summary
            </h2>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium text-sm sm:text-base">
                  Subtotal (3 items)
                </span>
                <span className="font-bold text-base sm:text-lg">₦ 19,200</span>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium text-sm sm:text-base">
                  Shipping
                </span>
                <span className="font-bold text-base sm:text-lg text-green-600">
                  Free
                </span>
              </div>

              <div className="flex justify-between items-center py-3 sm:py-4 bg-pink-50 rounded-lg px-3 sm:px-4">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Total
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-purple-600">
                  ₦ 19,200
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                Proceed to Checkout
              </button>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
