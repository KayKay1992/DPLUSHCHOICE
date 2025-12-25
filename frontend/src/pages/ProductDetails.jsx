import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import StarRating from "../components/StarRating";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, selectCurrentCart } from "../redux/cartRedux";
import { useNavigate } from "react-router-dom";
import { getWishlistIds, toggleWishlistId } from "../utils/wishlistStorage";
import { addRecentlyViewedId } from "../utils/recentlyViewedStorage";
import RecentlyViewedSection from "../components/RecentlyViewedSection";
import RecommendedProductsSection from "../components/RecommendedProductsSection";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const isOutOfStock = product ? (product.stock || 0) <= 0 : false;
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector(selectCurrentCart);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [inWishlist, setInWishlist] = useState(() =>
    getWishlistIds().includes(String(productId))
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await userRequest.get(`/products/find/${productId}`);
        setProduct(res.data);
        addRecentlyViewedId(productId);
        setLoading(false);
      } catch (err) {
        setError("Product not found");
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await userRequest.get(`/reviews/product/${productId}`);
        setReviews(res.data);
        setReviewsLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Check if wholesale pricing should be active
  const isWholesaleActive =
    product.wholesalePrice &&
    product.wholesaleMinimumQuantity &&
    quantity >= product.wholesaleMinimumQuantity;

  // Get the current price (wholesale or regular)
  const getCurrentPrice = () => {
    if (isWholesaleActive) {
      return product.wholesalePrice;
    }
    return product.discountPrice || product.originalPrice;
  };

  // Get the original price (always the base price)
  const getOriginalPrice = () => {
    return product.originalPrice;
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  // Format date for reviews
  const formatReviewDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddToCart = () => {
    if (isAddingToCart) return; // Prevent multiple clicks

    // Check if user is logged in
    if (!currentUser) {
      toast.info("Please login to add items to your cart", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    // Check if product is out of stock
    if (isOutOfStock) {
      toast.error("This product is currently out of stock", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Check stock availability including existing cart quantity
    const availableStock = product.stock || 50;
    const existingProduct = cart.products.find(
      (p) => p.id === (product._id || productId)
    );
    const currentCartQuantity = existingProduct ? existingProduct.quantity : 0;
    const totalQuantity = currentCartQuantity + quantity;
    if (totalQuantity > availableStock) {
      toast.error(
        `Only ${availableStock} items available in stock. You already have ${currentCartQuantity} in your cart.`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    setIsAddingToCart(true);

    const price = getCurrentPrice();
    const email = currentUser?.email || "guest@example.com"; // Use guest email if not logged in

    dispatch(
      addProduct({
        ...product,
        quantity,
        price,
        email,
        id: product._id || productId, // Ensure we have an ID
        isWholesale: isWholesaleActive, // Add wholesale flag
        stock: availableStock, // Add stock info
      })
    );

    toast.success(`${product.title} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setIsAddingToCart(false);
    console.log("Cart after addition:", cart);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Product Images and Gallery */}
          <div className="lg:w-1/2 p-8">
            <div className="relative">
              <img
                src={
                  product.img
                    ? product.img.startsWith("http")
                      ? product.img
                      : `http://localhost:8000/${product.img}`
                    : "/placeholder.jpg"
                }
                alt={product.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
          {/* Right Side - Product Info, Reviews, and Purchase Options */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                {/* Placeholder for brand */}
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.brand || "Brand Name"}
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                {/* Placeholder for categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.categories &&
                    product.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.desc}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <StarRating rating={calculateAverageRating()} starSize={24} />
                  <span className="ml-2 text-gray-600">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
                {/* Placeholder for skin type and concern */}
                {product.skinType && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Skin Type:</strong> {product.skinType.join(", ")}
                  </p>
                )}
                {product.concern && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Concern:</strong> {product.concern.join(", ")}
                  </p>
                )}
                <div className="flex items-center mb-4">
                  {getOriginalPrice() &&
                    getOriginalPrice() !== getCurrentPrice() && (
                      <span className="text-lg text-gray-500 line-through mr-4">
                        {formatPrice(getOriginalPrice())}
                      </span>
                    )}
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">
                    {formatPrice(getCurrentPrice())}
                  </h2>
                  {isWholesaleActive && (
                    <span className="ml-3 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                      WHOLESALE
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {isOutOfStock
                    ? "Out of Stock"
                    : `In Stock (${product.stock || 50} available)`}
                </p>
              </div>
              {product.whatinbox && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-6 mb-6">
                  <h2 className="flex items-center justify-center font-semibold text-lg text-gray-700 mb-4">
                    WHAT'S IN THE BOX
                  </h2>
                  <hr className="mb-4" />
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.whatinbox }}
                  />
                </div>
              )}
              {product.wholesalePrice && product.wholesaleMinimumQuantity && (
                <div
                  className={`inline-flex items-center font-semibold text-sm px-6 py-3 rounded-full shadow-md mb-6 ${
                    isWholesaleActive
                      ? "bg-green-500 text-white"
                      : "bg-linear-to-r from-pink-400 to-purple-400 text-white"
                  }`}
                >
                  {isWholesaleActive ? (
                    <>
                      🎉 Wholesale Price Active:{" "}
                      {formatPrice(product.wholesalePrice)} per unit
                    </>
                  ) : (
                    <>
                      Wholesale Price: {formatPrice(product.wholesalePrice)} per
                      unit (min. {product.wholesaleMinimumQuantity} units)
                    </>
                  )}
                </div>
              )}
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className={`p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    isOutOfStock
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-pink-500 hover:bg-pink-600 text-white"
                  }`}
                >
                  <FaMinus />
                </button>
                <span className="text-lg font-semibold mx-4 px-4 py-2 bg-gray-100 rounded-lg">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock || 50, quantity + 1))
                  }
                  disabled={isOutOfStock}
                  className={`p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    isOutOfStock
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-pink-500 hover:bg-pink-600 text-white"
                  }`}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  className={`w-full sm:flex-1 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                    isOutOfStock || isAddingToCart
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  }`}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : isAddingToCart
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                <button
                  type="button"
                  disabled={isTogglingWishlist}
                  onClick={async () => {
                    if (isTogglingWishlist) return;
                    setIsTogglingWishlist(true);
                    const next = !inWishlist;
                    setInWishlist(next);
                    toggleWishlistId(productId);
                    try {
                      if (currentUser?._id) {
                        if (next) {
                          await userRequest.post(
                            `/users/${currentUser._id}/wishlist/${productId}`
                          );
                        } else {
                          await userRequest.delete(
                            `/users/${currentUser._id}/wishlist/${productId}`
                          );
                        }
                      }
                      toast.success(
                        next ? "Added to wishlist" : "Removed from wishlist"
                      );
                    } catch (e) {
                      console.log(e);
                      setInWishlist(!next);
                      toggleWishlistId(productId);
                      toast.error("Failed to update wishlist");
                    } finally {
                      setIsTogglingWishlist(false);
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-4 rounded-full border border-pink-200 text-pink-700 hover:bg-pink-50 font-bold shadow-sm flex items-center justify-center gap-3"
                >
                  {inWishlist ? <FaHeart /> : <FaRegHeart />}
                  <span>{inWishlist ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>

            <div>
              <hr className="my-6" />
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Customer Reviews ({reviews.length})
                </h2>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div
                        key={review._id || index}
                        className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {review.userName || "Anonymous"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatReviewDate(review.createdAt)}
                            </span>
                          </div>
                          <StarRating rating={review.rating} starSize={16} />
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No reviews yet.</p>
                    <p className="text-sm text-gray-500">
                      Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecommendedProductsSection
        currentProduct={product}
        excludeId={productId}
        limit={8}
      />

      <RecentlyViewedSection excludeId={productId} limit={8} />
    </div>
  );
};

export default ProductDetails;
