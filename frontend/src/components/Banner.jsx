const Banner = () => {
  return (
    <div
      className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/beautybanner2.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-black/70 via-fuchsia-900/40 to-emerald-900/30"></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-6 md:w-2/3 lg:w-1/2 py-12">
        <span className="text-3xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
          Discover Your Radiance With Our Handpicked Beauty Essentials
        </span>
        <h1 className="text-base md:text-xl mb-8 text-white/90 font-medium">
          Elevate your beauty routine with our curated selection of top-tier
          products, designed to enhance your natural glow and confidence.
        </h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center">
          <button className="bg-linear-to-r from-fuchsia-500 via-pink-400 to-pink-500 px-8 py-3 rounded-full text-white font-bold shadow-lg hover:scale-105 hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-300">
            Shop Now
          </button>
          <button className="bg-white px-8 py-3 rounded-full text-fuchsia-600 font-bold shadow-lg border-2 border-fuchsia-200 hover:bg-gray-100 hover:text-fuchsia-700 transition-all duration-300">
            Call Us: +2348123456789
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
