import React from "react";
import { FaInstagram, FaTiktok, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/products" },
];

const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      <div className="relative z-10 px-6 md:px-12 lg:px-24 py-16">
        {/* Upper Part */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <img
              src="/logo.jpg"
              alt="D' Plush Choice Logo"
              className="h-24 w-24 rounded-full mx-auto md:mx-0 mb-4 ring-4 ring-pink-400 shadow-lg"
            />
            <p className="text-gray-300 leading-relaxed">
              LET'S MAKE BEAUTY BLISSFUL WITH D' PLUSH CHOICE AND ENHANCE YOUR
              BEAUTY ROUTINE WITH ATTRACTIVE SCENTS
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-6 bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300 transform hover:translate-x-2 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-6 bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <div className="space-y-3 text-gray-300">
              <p className="leading-relaxed">
                Suite 9 Chizaram Plaza, Road 1 Ebony Road, Orazi, Port Harcourt,
                500272
              </p>
              <p>
                <span className="font-semibold text-pink-400">Email:</span>{" "}
                dplushchoice@gmail.com
              </p>
              <p>
                <span className="font-semibold text-pink-400">Phone:</span>{" "}
                +2347040334276
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Lower Part: Copyright and Social Media */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} D' Plush Choice. All rights
                reserved. | Made with ❤️ for beauty lovers.
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/dplush_choice?igsh=MW9lZ3ZazQweXhydQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <FaInstagram size={28} />
              </a>
              <a
                href="https://www.tiktok.com/@plush_sophia?_r=1&_t=ZS-91wBUJ2Rqkh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
                aria-label="TikTok"
              >
                <FaTiktok size={28} />
              </a>
              <a
                href="https://wa.me/2347040334276"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={28} />
              </a>
              <a
                href="https://www.facebook.com/share/17jjEpzmWg/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <FaFacebook size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
