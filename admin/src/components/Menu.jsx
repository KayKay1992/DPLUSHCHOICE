// src/components/Menu.jsx — FINAL: Sticky on Desktop, Classic Slide-In on Mobile
import { useState } from "react";
import {
  FaHome, FaUser, FaUsers, FaBox, FaClipboardList,
  FaElementor, FaCog, FaHdd, FaChartBar, FaClipboard,
  FaSignOutAlt, FaBars, FaTimes,
} from "react-icons/fa";

const Menu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: FaHome, label: "Home" },
    { icon: FaUser, label: "Profile" },
  ];
  const managementItems = [
    { icon: FaUsers, label: "Users" }, { icon: FaBox, label: "Products" }, { icon: FaClipboardList, label: "Orders" }
  ];
  const contentItems =     [{ icon: FaElementor, label: "Banners" }, { icon: FaCog, label: "Settings" }, { icon: FaHdd, label: "Backups" }];
  const analyticsItems =   [{ icon: FaChartBar, label: "Analytics" }, { icon: FaClipboard, label: "All Logs" }];

  const MenuItem = ({ icon: Icon, label }) => (
    <li className="group flex items-center space-x-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/10">
      <Icon className="text-xl text-gray-400 group-hover:text-pink-400 transition-colors" />
      <span className="font-medium text-gray-300 group-hover:text-white">{label}</span>
    </li>
  );

  const MenuSection = ({ title, items }) => (
    <div className="mb-10">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-5">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => <MenuItem key={i} {...item} />)}
      </ul>
    </div>
  );

  return (
    <>
      {/* MOBILE: Hamburger — Top Right (exactly like before) */}
      <div className="lg:hidden fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-14 h-14 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
        >
          {isMobileMenuOpen ? <FaTimes className="text-white text-2xl" /> : <FaBars className="text-white text-2xl" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        /* Mobile: full-screen slide-in from left */
        fixed inset-y-0 left-0 z-40 w-80
        bg-linear-to-b from-gray-900 via-gray-900/98 to-gray-950
        border-r border-white/10 shadow-2xl
        transition-transform duration-500 ease-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}

        /* Desktop: sticky, full height, always visible */
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:w-96
      `}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-br from-pink-600/8 via-purple-600/5 to-cyan-600/8 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-64 bg-linear-to-r from-pink-500/10 to-purple-600/10" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col overflow-hidden">
          {/* HEADER — Your original beautiful one (unchanged on mobile) */}
          <div className="shrink-0 px-8 pt-12 pb-8 lg:pt-10">
            <div className="relative">
              <div className="absolute -inset-6 bg-linear-to-r from-pink-500/25 via-purple-500/20 to-cyan-500/25 blur-3xl opacity-70" />
              <div className="relative bg-white/8 backdrop-blur-3xl rounded-3xl p-7 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-pink-400 to-purple-500 blur-xl opacity-70 scale-125" />
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-pink-500/40 shadow-2xl">
                      <img src="/logo.jpg" alt="DPC" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-black bg-linear-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                      D' Plush Choice
                    </h1>
                    <p className="text-sm font-medium text-gray-300 mt-1">Admin Panel</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                      </span>
                      <span className="text-xs text-green-400 font-medium">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MENU — Scrolls perfectly */}
          <nav className="flex-1 overflow-y-auto px-8 pb-6 scrollbar-thin scrollbar-thumb-pink-500/30">
            <MenuSection title="Dashboard" items={menuItems} />
            <MenuSection title="Management" items={managementItems} />
            <MenuSection title="Content" items={contentItems} />
            <MenuSection title="Analytics" items={analyticsItems} />
          </nav>

          {/* FOOTER — Always at bottom */}
          <div className="shrink-0 border-t border-white/10 px-8 py-6 space-y-5">
            <div className="group flex items-center space-x-4 px-5 py-4 rounded-2xl cursor-pointer hover:bg-red-500/10">
              <FaSignOutAlt className="text-xl text-gray-400 group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-gray-300 group-hover:text-red-400">Logout</span>
            </div>
            <p className="text-center text-xs text-gray-500">© 2025 D' Plush Choice</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;