import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userRedux";
import { clearUserCart, setCurrentUser } from "../redux/cartRedux";

const categories = [
  { slug: "perfumes", name: "Perfumes", image: "/perfume.jpg" },
  { slug: "body-sprays", name: "Body Sprays", image: "/body spray.jpg" },
  { slug: "diffusers", name: "Diffusers", image: "/diffusers.jpg" },
  {
    slug: "scented-candles",
    name: "Scented Candles",
    image: "/scented candles.jpg",
  },
  { slug: "necklace", name: "Necklace", image: "/Necklace.jpg" },
  { slug: "earrings", name: "Earrings", image: "/earring.jpg" },
  { slug: "rings", name: "Rings", image: "/rings.avif" },
  { slug: "wristwatches", name: "Wristwatches", image: "/wristwatch.jpg" },
  { slug: "anklets", name: "Anklets", image: "/anklets.jpg" },
  { slug: "bracelets", name: "Bracelets", image: "/bracelets.jpg" },
  { slug: "bangles", name: "Bangles", image: "/bangles.jpg" },
  { slug: "bags", name: "Bags", image: "/bags.jpg" },
  { slug: "clutch-purse", name: "Clutch Purse", image: "/clutch purse.jpg" },
  { slug: "jewelry-set", name: "Jewelry Set", image: "/jewery set.jpg" },
  {
    slug: "other-accessories",
    name: "Other accessories",
    image: "/product1.png",
  },
];

const SideMenu = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setCurrentUser(null));
    onClose();
  };

  const handleCategoryClick = (slug) => {
    navigate(`/products/category/${slug}`);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "block" : "hidden"}`}
    >
      {/* Blurred Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Side Menu */}
      <div
        className={`absolute top-0 left-0 h-full w-80 bg-linear-to-br from-white via-pink-50 to-purple-50 shadow-2xl rounded-r-3xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-500 ease-out`}
      >
        <div className="p-8 h-full flex flex-col">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-600 hover:text-pink-600 text-3xl transition-colors duration-200"
          >
            ✕
          </button>

          {/* Logo and Header */}
          <div className="flex items-center mb-8">
            <img
              src="/logo.jpg"
              alt="D' Plush Choice Logo"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-pink-200 shadow-lg mr-4"
            />
            <h2 className="text-2xl font-extrabold bg-linear-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent">
              Shop by Category
            </h2>
          </div>

          {/* User Account Section */}
          {currentUser && (
            <div className="mb-6 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-linear-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {currentUser.name || currentUser.username || "User"}
                  </p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  to="/myaccount"
                  onClick={onClose}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-lg transition-colors duration-200"
                >
                  <FaUser className="text-lg" />
                  <span className="font-medium">My Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {categories.map((cat, index) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCategoryClick(cat.slug);
                  }
                }}
                className="flex items-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 hover:bg-white hover:shadow-lg hover:scale-105 hover:border-pink-200 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 rounded-xl bg-linear-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="ml-4 text-lg font-semibold text-gray-800 group-hover:text-pink-700 transition-colors duration-300">
                  {cat.name}
                </span>
                <svg
                  className="ml-auto w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
