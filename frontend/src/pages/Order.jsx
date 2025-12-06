import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import StarRating from "../components/StarRating";

const Order = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30 inline-block">
            <FaCheckCircle className="text-7xl text-green-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              Thank you for your purchase. Your order has been successfully
              placed and is being processed.
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
              <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Order Summary
              </h2>
              <div className="space-y-6">
                {/* Product 1 */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/40">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">
                    Order #123456
                  </h3>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 border-b border-gray-200/50 pb-6">
                    <img
                      src="/lotion2.jpg"
                      alt="Elegant Plush Toy"
                      className="w-20 h-20 object-cover rounded-xl shadow-md border border-white/50"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg mb-1">
                        Elegant Plush Toy
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        Quantity: 1
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-xl">₦ 6,200</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                      Rate This Product:
                    </h3>
                    <StarRating rating={4} />
                    <textarea
                      className="mt-4 w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
                      rows="4"
                      placeholder="Write a review..."
                    ></textarea>
                    <button className="mt-4 bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Submit Review
                    </button>
                  </div>
                </div>

                {/* Product 2 */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/40">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 border-b border-gray-200/50 pb-6">
                    <img
                      src="/perfume.jpg"
                      alt="Luxury Perfume"
                      className="w-20 h-20 object-cover rounded-xl shadow-md border border-white/50"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg mb-1">
                        Luxury Perfume
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        Quantity: 2
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-xl">
                        ₦ 12,500
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                      Rate This Product:
                    </h3>
                    <StarRating rating={5} />
                    <textarea
                      className="mt-4 w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
                      rows="4"
                      placeholder="Write a review..."
                    ></textarea>
                    <button className="mt-4 bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Shipping Information
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Address:</span>
                  <br />
                  123 Main Street, City, Country
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Email:</span>{" "}
                  YtWQ5@example.com
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Phone:</span> +1 (123)
                  456-7890
                </p>
                <p className="text-gray-700 font-medium mt-4 text-lg">
                  John Doe
                </p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Payment Information
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Method:</span> Credit Card
                </p>
                <p className="text-gray-700 font-medium text-lg">
                  <span className="text-gray-500">Total Paid:</span> ₦ 18,700
                </p>
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Order Total
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-gray-800 font-semibold">₦ 18,700</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Shipping:</span>
                  <span className="text-gray-800 font-semibold">₦ 1,500</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3 mt-3">
                  <span className="text-gray-900 font-bold text-lg">
                    Total:
                  </span>
                  <span className="font-bold text-2xl bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    ₦ 20,200
                  </span>
                </div>
              </div>
            </div>

            {/* Continue Shopping Button */}
            <div className="text-center pt-4">
              <button className="bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg w-full">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
