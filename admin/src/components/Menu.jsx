import { useState } from "react";
import {
  FaBox,
  FaHome,
  FaUsers,
  FaUser,
  FaChartBar,
  FaElementor,
  FaClipboard,
  FaClipboardList,
  FaCog,
  FaHdd,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Menu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: FaHome, label: "Home" },
    { icon: FaUser, label: "Profile" },
  ];

  const managementItems = [
    { icon: FaUsers, label: "Users" },
    { icon: FaBox, label: "Products" },
    { icon: FaClipboardList, label: "Orders" },
  ];

  const contentItems = [
    { icon: FaElementor, label: "Banners" },
    { icon: FaCog, label: "Settings" },
    { icon: FaHdd, label: "Backups" },
  ];

  const analyticsItems = [
    { icon: FaChartBar, label: "Analytics" },
    { icon: FaClipboard, label: "All Logs" },
  ];

  const MenuItem = ({ icon: Icon, label, isActive = false, onClick }) => {
    return (
      <li
        className={`
        group relative flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl cursor-pointer
        transition-all duration-300 transform hover:scale-105 hover:shadow-lg
        ${
          isActive
            ? "bg-linear-to-r from-pink-500/20 to-purple-500/20 text-white shadow-lg border border-pink-400/30"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        }
      `}
        onClick={onClick}
      >
        <Icon
          className={`
          text-lg sm:text-xl transition-all duration-300
          ${
            isActive
              ? "text-pink-400"
              : "text-gray-400 group-hover:text-pink-400"
          }
        `}
        />
        <span
          className={`
          font-medium text-sm sm:text-base transition-all duration-300
          ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}
        `}
        >
          {label}
        </span>
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 sm:h-8 bg-linear-to-b from-pink-400 to-purple-400 rounded-r-full"></div>
        )}
      </li>
    );
  };

  const MenuSection = ({ title, items }) => (
    <div className="mb-6 sm:mb-8">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 px-3 sm:px-4">
        {title}
      </h3>
      <ul className="space-y-1 sm:space-y-2">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            {...item}
            isActive={index === 0 && title === "Dashboard"}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ))}
      </ul>
    </div>
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="w-12 h-12 bg-linear-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-white text-lg" />
          ) : (
            <FaBars className="text-white text-lg" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu */}
      <div
        className={`
        h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-r border-white/10 shadow-2xl relative overflow-hidden transition-all duration-300 z-50
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full sm:translate-x-0"
        }
        w-full sm:w-[280px] lg:w-[320px]
        fixed sm:relative top-0 left-0
      `}
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 via-transparent to-purple-500/5"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-linear-to-r from-pink-500/10 to-purple-500/10 rounded-bl-2xl sm:rounded-bl-3xl"></div>
        <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-20 sm:w-32 h-20 sm:h-32 bg-pink-500/20 rounded-full blur-xl sm:blur-2xl"></div>
        <div className="absolute top-16 sm:top-20 -left-6 sm:-left-10 w-16 sm:w-24 h-16 sm:h-24 bg-purple-500/20 rounded-full blur-lg sm:blur-xl"></div>

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col">
          {/* Logo/Brand Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/logo.jpg.jpg"
                  alt="D' Plush Choice Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  D' Plush Choice
                </h1>
                <p className="text-xs text-gray-400 font-medium">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
            <MenuSection title="Dashboard" items={menuItems} />
            <MenuSection title="Management" items={managementItems} />
            <MenuSection title="Content" items={contentItems} />
            <MenuSection title="Analytics" items={analyticsItems} />
          </div>

          {/* Logout Section */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <div
              className="group flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-red-500/10 text-gray-300 hover:text-red-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaSignOutAlt className="text-lg sm:text-xl text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
              <span className="font-medium text-sm sm:text-base">Logout</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              © 2025 D' Plush Choice
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
