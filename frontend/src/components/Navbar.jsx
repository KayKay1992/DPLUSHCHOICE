import { FaSearch, FaUser } from "react-icons/fa";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Badge from "@mui/material/Badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-20">
          {/* Hamburger + Logo + Brand Name */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              <img
                src="/logo.jpg"
                alt="D' Plush Choice Logo"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-pink-100 shadow-md"
              />
              <span className="text-xl sm:text-2xl font-bold text-pink-600 tracking-tight">
                D' Plush Choice
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search plushies, toys, gifts..."
                className="w-full px-5 py-3 pl-12 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 text-xl" />
            </div>
          </div>

          {/* Cart + Login (Always Visible) */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart">
              <Badge badgeContent={4} color="secondary" overlap="circular">
                <div className="p-3 rounded-full hover:bg-pink-50 transition cursor-pointer group">
                  <ShoppingBasketIcon className="text-2xl text-pink-600 group-hover:text-pink-700 transition" />
                </div>
              </Badge>
            </Link>

            {/* Login Button with Icon + Text */}
            <Link to="/login">
              <button className="flex items-center space-x-2 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-5 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                <FaUser className="text-lg" />
                <span className="text-sm sm:text-base">Login</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Search with Menu Icon (Only on small screens) */}
        <div className="md:hidden px-2 pb-4 -mt-2 flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full px-5 py-3 pl-12 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none text-gray-800 placeholder-gray-400 font-medium"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 text-xl" />
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="ml-3 p-3 text-pink-600 hover:text-pink-700 transition rounded-full hover:bg-pink-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Side Menu */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  );
};

export default Navbar;
