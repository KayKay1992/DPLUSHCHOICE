import { FaPlus } from "react-icons/fa";

const NewProduct = () => {
  return (
    <div className="min-h-screen bg-linear-to-tr from-indigo-900 via-purple-900/40 to-pink-900/30 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                New Product
              </h1>
              <p className="text-gray-200 mt-3 text-base sm:text-lg font-medium">
                Add a new product to your catalog
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 lg:p-10">
          <form className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-pink-400/50 rounded-2xl p-8 text-center bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <FaPlus className="text-pink-400 text-4xl mb-3" />
                    <span className="text-gray-300 font-medium">
                      Click to upload product image
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Description
                </label>
                <textarea
                  rows={6}
                  placeholder="Enter detailed product description"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Product Original Price */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Original Price
                </label>
                <input
                  type="number"
                  placeholder="Enter original price"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              {/* Product Discounted Price */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Discounted Price
                </label>
                <input
                  type="number"
                  placeholder="Enter discounted price"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-6">
              {/* Product Wholesale Price */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Wholesale Price
                </label>
                <input
                  type="number"
                  placeholder="Enter wholesale price"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              {/* Wholesale Minimum Quantity */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Wholesale Minimum Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter minimum wholesale quantity"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              {/* Product Brand */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Product Brand
                </label>
                <input
                  type="text"
                  placeholder="Enter product brand"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              {/* Concern */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Concern
                </label>
                <select className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
                  <option value="" disabled selected className="bg-slate-800">
                    Select Concern
                  </option>
                  <option value="anti-acne" className="bg-slate-800">
                    Anti Acne
                  </option>
                  <option value="sunburn" className="bg-slate-800">
                    Sunburn
                  </option>
                  <option value="skin-brightening" className="bg-slate-800">
                    Skin Brightening
                  </option>
                  <option value="tan-removal" className="bg-slate-800">
                    Tan Removal
                  </option>
                  <option value="night-routine" className="bg-slate-800">
                    Night Routine
                  </option>
                  <option value="uv-protection" className="bg-slate-800">
                    UV Protection
                  </option>
                  <option value="damaged-hair" className="bg-slate-800">
                    Damaged Hair
                  </option>
                  <option value="frizzy-hair" className="bg-slate-800">
                    Frizzy Hair
                  </option>
                  <option value="stretch-mark" className="bg-slate-800">
                    Stretch Mark
                  </option>
                  <option value="colour-protection" className="bg-slate-800">
                    Colour Protection
                  </option>
                  <option value="dry-hair" className="bg-slate-800">
                    Dry Hair
                  </option>
                  <option value="soothing" className="bg-slate-800">
                    Soothing
                  </option>
                  <option value="dandruff" className="bg-slate-800">
                    Dandruff
                  </option>
                  <option value="greying" className="bg-slate-800">
                    Greying
                  </option>
                  <option value="hairfall" className="bg-slate-800">
                    Hairfall
                  </option>
                  <option value="hair-colour" className="bg-slate-800">
                    Hair Colour
                  </option>
                  <option value="well-being" className="bg-slate-800">
                    Well Being
                  </option>
                  <option value="acne" className="bg-slate-800">
                    Acne
                  </option>
                  <option value="hair-growth" className="bg-slate-800">
                    Hair Growth
                  </option>
                  <option value="dry-skin" className="bg-slate-800">
                    Dry Skin
                  </option>
                  <option value="pigmentation" className="bg-slate-800">
                    Pigmentation
                  </option>
                  <option value="oil-control" className="bg-slate-800">
                    Oil Control
                  </option>
                </select>
              </div>

              {/* Skin Type */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Skin Type
                </label>
                <select className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
                  <option value="" disabled selected className="bg-slate-800">
                    Select Skin Type
                  </option>
                  <option value="all" className="bg-slate-800">
                    All
                  </option>
                  <option value="oily" className="bg-slate-800">
                    Oily
                  </option>
                  <option value="dry" className="bg-slate-800">
                    Dry
                  </option>
                  <option value="sensitive" className="bg-slate-800">
                    Sensitive
                  </option>
                  <option value="normal" className="bg-slate-800">
                    Normal
                  </option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Category
                </label>
                <select className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
                  <option value="" disabled selected className="bg-slate-800">
                    Select Category
                  </option>
                  <option value="perfumes" className="bg-slate-800">
                    Perfumes
                  </option>
                  <option value="body-sprays" className="bg-slate-800">
                    Body Sprays
                  </option>
                  <option value="diffusers" className="bg-slate-800">
                    Diffusers
                  </option>
                  <option value="scented-candles" className="bg-slate-800">
                    Scented Candles
                  </option>
                  <option value="necklace" className="bg-slate-800">
                    Necklace
                  </option>
                  <option value="earrings" className="bg-slate-800">
                    Earrings
                  </option>
                  <option value="rings" className="bg-slate-800">
                    Rings
                  </option>
                  <option value="wristwatches" className="bg-slate-800">
                    Wristwatches
                  </option>
                  <option value="anklets" className="bg-slate-800">
                    Anklets
                  </option>
                  <option value="bracelets" className="bg-slate-800">
                    Bracelets
                  </option>
                  <option value="bangles" className="bg-slate-800">
                    Bangles
                  </option>
                  <option value="bags" className="bg-slate-800">
                    Bags
                  </option>
                  <option value="clutch-purse" className="bg-slate-800">
                    Clutch Purse
                  </option>
                  <option value="jewelry-set" className="bg-slate-800">
                    Jewelry Set
                  </option>
                  <option value="other-accessories" className="bg-slate-800">
                    Other Accessories
                  </option>
                </select>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter stock quantity"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              {/* In Stock */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  In Stock
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    className="mr-3 w-5 h-5 accent-pink-400"
                    defaultChecked
                  />
                  <label
                    htmlFor="inStock"
                    className="font-medium text-gray-200"
                  >
                    Product is available in stock
                  </label>
                </div>
              </div>

              {/* Create Button */}
              <div className="pt-4">
                <button className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                  Create Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
