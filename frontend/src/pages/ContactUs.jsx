import { FaInstagram, FaTiktok, FaWhatsapp, FaFacebook } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-6">
          Contact Us
        </h1>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 p-6 sm:p-10 text-gray-700 space-y-4">
          <p className="leading-relaxed">
            Suite 9 Chizaram Plaza, Road 1 Ebony Road, Orazi, Port Harcourt,
            500272
          </p>

          <p>
            <span className="font-semibold text-pink-600">Email:</span>{" "}
            <a
              className="text-purple-700 hover:underline"
              href="mailto:dplushchoice@gmail.com"
            >
              dplushchoice@gmail.com
            </a>
          </p>

          <p>
            <span className="font-semibold text-pink-600">Phone:</span>{" "}
            <a
              className="text-purple-700 hover:underline"
              href="tel:+2347040334276"
            >
              +2347040334276
            </a>
          </p>

          <div className="pt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Follow Us</h2>
            <div className="flex items-center gap-5">
              <a
                href="https://www.instagram.com/dplush_choice?igsh=MW9lZ3ZazQweXhydQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={28} />
              </a>
              <a
                href="https://www.tiktok.com/@plush_sophia?_r=1&_t=ZS-91wBUJ2Rqkh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok size={28} />
              </a>
              <a
                href="https://wa.me/2347040334276"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={28} />
              </a>
              <a
                href="https://www.facebook.com/share/17jjEpzmWg/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
