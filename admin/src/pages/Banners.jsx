import React from "react";
import { FaPlus, FaImage, FaEye, FaTrash } from "react-icons/fa";

const Banners = () => {
  const banners = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop",
      title: "Luxurious Perfume Collection",
      description:
        "Discover our exquisite range of premium perfumes. From floral scents to oriental fragrances, find your signature aroma that lasts all day.",
      status: "Active",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
      title: "Elegant Wristwatch Collection",
      description:
        "Timeless elegance meets modern design. Explore our collection of premium wristwatches, perfect for any occasion with Swiss precision and style.",
      status: "Active",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      title: "Designer Ladies Handbags",
      description:
        "Elevate your style with our curated collection of designer handbags. From classic totes to trendy crossbody bags, find the perfect accessory.",
      status: "Active",
    },
  ];

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
                  {banners.filter((b) => b.status === "Active").length}
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
                <p className="text-3xl font-bold text-white">
                  {banners.filter((b) => b.status === "Inactive").length}
                </p>
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
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-20 h-20 object-cover rounded-xl shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {banner.title}
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {banner.description}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-400/30">
                          {banner.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 p-2 rounded-xl transition-all duration-300 border border-red-400/30">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
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
                  <div className="flex flex-col items-center">
                    <FaPlus className="text-pink-400 text-3xl mb-2" />
                    <span className="text-gray-300">
                      Click to upload banner image
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter banner title"
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
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
                  />
                </div>
                <button className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                  Add Banner
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
