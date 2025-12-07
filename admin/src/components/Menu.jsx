// src/components/Menu.jsx (or wherever you keep it)
import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaBox,
  FaClipboardList,
  FaElementor,
  FaCog,
  FaHdd,
  FaChartBar,
  FaClipboard,
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

  const MenuItem = ({ icon: Icon, label }) => {
    return (
      <li
        className="
          group relative flex items-center space-x-4 px-4 py-3.5 rounded-xl cursor-pointer
          transition-all duration-300 transform hover:scale-105 hover:shadow-lg
          text-gray-300 hover:text-white hover:bg-white/10
        "
      >
        <Icon
          className="
            text-xl transition-all duration-300
            text-gray-400 group-hover:text-pink-400
          "
        />
        <span
          className="
            font-medium text-base transition-all duration-300
            text-gray-300 group-hover:text-white
          "
        >
          {label}
        </span>
      </li>
    );
  };

  const MenuSection = ({ title, items }) => (
    <div className="mb-8">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <MenuItem key={i} {...item} />
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="sm:hidden fixed top-5 left-5 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-12 h-12 bg-linear-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-2xl hover:shadow-pink-500/50 transition-all duration-300"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-white text-xl" />
          ) : (
            <FaBars className="text-white text-xl" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed sm:static top-0 left-0 h-screen w-[280px] bg-linear-to-b from-gray-900 via-gray-800 to-gray-900
          border-r border-white/10 shadow-2xl z-40 overflow-hidden
          transition-transform duration-500 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0"
          }
        `}
      >
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-pink-500/10 to-purple-500/10 rounded-bl-3xl" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col pt-20 sm:pt-8 px-6">
          {/* Logo - Responsive */}
          <div className="mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xl shrink-0">
                <img
                  src="/logo.jpg" // Put your logo in public/logo.jpg
                  alt="D' Plush Choice"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                {/* Full name on desktop, short on mobile */}
                <h1 className="hidden sm:block text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  D' Plush Choice
                </h1>
                <h1 className="sm:hidden text-xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  DPC
                </h1>
                <p className="hidden sm:block text-sm text-gray-400">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Menu */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/30 scrollbar-track-transparent hover:scrollbar-thumb-pink-500/60 pb-6">
            <MenuSection title="Dashboard" items={menuItems} />
            <MenuSection title="Management" items={managementItems} />
            <MenuSection title="Content" items={contentItems} />
            <MenuSection title="Analytics" items={analyticsItems} />
          </div>

          {/* Logout */}
          <div className="pt-6 border-t border-white/10">
            <div
              onClick={() => {
                // dispatch(logout()); // ← Connect your logout action here
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              className="group flex items-center space-x-4 px-4 py-4 rounded-xl cursor-pointer hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-all duration-300"
            >
              <FaSignOutAlt className="text-xl group-hover:text-red-400 transition-colors" />
              <span className="font-medium">Logout</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">© 2025 D' Plush Choice</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
