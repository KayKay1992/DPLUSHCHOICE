import { FaMinus, FaPlus, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeProduct,
  clearCart,
  addProduct,
  selectCurrentCart,
  updateProductQuantity,
} from "../redux/cartRedux";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, quantity, total } = useSelector(selectCurrentCart);
  const { currentUser } = useSelector((state) => state.user);

  // Redirect guests to login
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct({ id: productId }));
    toast.success("Product removed from cart!");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared!");
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId);
    if (product && newQuantity > (product.stock || 50)) {
      toast.error(
        `Only ${
          product.stock || 50
        } items available in stock. You already have ${
          product.quantity
        } in your cart.`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }
    dispatch(updateProductQuantity({ productId, quantity: newQuantity }));
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white text-pink-600 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <FaArrowLeft className="text-base sm:text-lg" />
              <span className="text-sm sm:text-base">Go Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600 text-center">
              Your Shopping Cart
            </h1>
            <div className="hidden sm:block w-32"></div>{" "}
            {/* Spacer for centering on larger screens */}
          </div>

          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some beautiful products to your cart!
            </p>
            <button
              onClick={() => navigate("/products/all")}
              className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Go Back Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white text-pink-600 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <FaArrowLeft className="text-base sm:text-lg" />
            <span className="text-sm sm:text-base">Go Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600 text-center">
            Your Shopping Cart
          </h1>
          <div className="hidden sm:block w-32"></div>{" "}
          {/* Spacer for centering on larger screens */}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Side - Cart Items */}
          <div className="flex-1 bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Items in Cart ({quantity})
              </h2>
              <button
                onClick={handleClearCart}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 sm:px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {products.map((product, index) => (
                <div
                  key={product.id || index}
                  className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                      <img
                        src={
                          product.img?.startsWith("http")
                            ? product.img
                            : `http://localhost:8000/${product.img}` ||
                              "/placeholder.jpg"
                        }
                        alt={product.title || product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                          {product.title || product.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {product.desc || "Product description"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-100 rounded-full p-1 w-full sm:w-auto justify-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.quantity - 1
                            )
                          }
                          className="bg-pink-500 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                        >
                          <FaMinus className="text-xs sm:text-sm" />
                        </button>
                        <span className="text-base sm:text-lg font-bold mx-3 sm:mx-4 px-2 sm:px-3 py-1 bg-white rounded-full shadow-sm min-w-8 text-center">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.quantity + 1
                            )
                          }
                          className="bg-pink-500 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                        >
                          <FaPlus className="text-xs sm:text-sm" />
                        </button>
                      </div>

                      {/* Price and Delete */}
                      <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-2">
                        <div className="text-left sm:text-right">
                          {product.isWholesale ? (
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                  WHOLESALE
                                </span>
                              </div>
                              <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-green-600">
                                {formatPrice(product.price * product.quantity)}
                              </p>
                              <p className="text-sm text-gray-400 line-through">
                                {formatPrice(
                                  (product.discountPrice ||
                                    product.originalPrice) * product.quantity
                                )}
                              </p>
                              <p className="text-sm text-green-600 font-semibold">
                                {formatPrice(product.price)} each (wholesale)
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-purple-600">
                                {formatPrice(product.price * product.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatPrice(product.price)} each
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all duration-300 self-end"
                        >
                          <FaTrashAlt className="text-lg sm:text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:w-96 bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 h-fit">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Order Summary
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Subtotal ({quantity} items)
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Shipping</span>
                <span className="text-lg font-semibold text-green-600">
                  Free
                </span>
              </div>

              {/* Tax */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Tax</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(0)}
                </span>
              </div>

              <hr className="border-gray-200" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                  <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-6">
                Proceed to Checkout
              </button>

              {/* Continue Shopping Button */}
              <button
                onClick={() => navigate("/products/all")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 mt-3"
              >
                Continue Shopping
              </button>

              {/* Payment Methods */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">We Accept:</p>
                <div className="flex gap-2 flex-wrap">
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium">
                    💳 Card
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium">
                    🏦 Bank Transfer
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium">
                    📱 Mobile Money
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600">🔒</span>
                  <span className="text-sm font-semibold text-green-800">
                    Secure Checkout
                  </span>
                </div>
                <p className="text-xs text-green-700">
                  Your payment information is encrypted and secure. We never
                  store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default Cart;
