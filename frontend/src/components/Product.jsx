import StarRating from "./StarRating";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/cartRedux";
import { toast } from "react-toastify";

const Product = ({
  img,
  name = "Elegant Plush Toy",
  price = 4500,
  category,
  rating = 4,
  isNew = false,
  isPopular = false,
  productId,
  product, // Add full product object
}) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product details

    // Check if user is logged in
    if (!currentUser) {
      toast.info("Please login to add items to your cart", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    const email = currentUser?.email || "guest@example.com";

    dispatch(
      addProduct({
        ...product,
        quantity,
        price,
        email,
        id: productId,
        title: name,
        img,
      })
    );

    toast.success(`${name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Format price with Nigerian Naira symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get category display name
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      "teddy-bears": "Teddy Bear",
      "plush-animals": "Plush Animal",
      "luxury-pillows": "Luxury Pillow",
      "decorative-items": "Decorative Item",
      "gift-sets": "Gift Set",
      seasonal: "Seasonal Item",
      custom: "Custom Order",
    };
    return categoryMap[category] || "Luxury Item";
  };

  return (
    <Link to={`/product/${productId}`}>
      <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-white/50 overflow-hidden">
        {/* Image Container */}
        <div className="relative h-80 w-full overflow-hidden rounded-t-3xl">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNew && (
              <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                New
              </div>
            )}
            {isPopular && (
              <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Popular
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {getCategoryDisplayName(category)}
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <button className="flex-1 bg-white/90 backdrop-blur-sm text-pink-600 hover:text-pink-700 font-semibold py-2 px-4 rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-300">
                Quick View
              </button>
              <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                ❤️
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-700 transition-colors duration-300 line-clamp-2">
            {name}
          </h3>
          <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600 mb-4">
            {formatPrice(price)}
          </p>
          <div className="flex justify-center items-center gap-2 mb-4">
            <StarRating rating={rating} starSize={20} />
            <span className="text-sm text-gray-600 font-medium">
              ({rating})
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <FaMinus className="text-sm" />
            </button>
            <span className="text-lg font-semibold px-3 py-1 bg-gray-100 rounded-lg min-w-10 text-center">
              {quantity}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(quantity + 1);
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
          >
            Add to Cart ({quantity})
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Product;
