import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";
import { clearUserCart } from "../redux/cartRedux";

const Order = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      let response;

      if (orderId) {
        // Fetch specific order by ID
        response = await userRequest.get(`/orders/${orderId}`);
        setOrder(response.data);
        // Clear cart after successful order retrieval
        dispatch(clearUserCart());
      } else {
        // Fetch user's latest order
        const userOrdersResponse = await userRequest.get(
          `/orders/find/${currentUser._id}`
        );
        const userOrders = userOrdersResponse.data;

        if (userOrders && userOrders.length > 0) {
          // Get the most recent order
          setOrder(userOrders[0]);
          // Clear cart after successful order retrieval
          dispatch(clearUserCart());
        } else {
          setError("No orders found");
        }
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details");
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getShippingStatus = (o) => {
    const raw = o?.shippingStatus;
    if (raw !== undefined && raw !== null && raw !== "") return Number(raw);
    return Number(o?.status) === 1 ? 3 : 0;
  };

  const shippingStatusLabel = (s) => {
    switch (Number(s)) {
      case 0:
        return "Pending";
      case 1:
        return "Processing";
      case 2:
        return "Shipped";
      case 3:
        return "Delivered";
      default:
        return "Pending";
    }
  };

  const formatMaybeDate = (d) => {
    if (!d) return "—";
    try {
      return formatDate(d);
    } catch {
      return "—";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-pink-500 mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30 max-w-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30 inline-block">
            <FaCheckCircle className="text-7xl text-green-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              Thank you for your purchase. Your order has been successfully
              placed and is being processed.
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
              <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Order Summary
              </h2>
              <div className="space-y-6">
                {/* Dynamic Products */}
                {order.products &&
                  order.products.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/40"
                    >
                      <h3 className="font-bold text-gray-800 mb-4 text-lg">
                        Order #{order._id ? order._id.slice(-8) : "N/A"}
                      </h3>
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 border-b border-gray-200/50 pb-6">
                        <img
                          src={product.img || "/placeholder.jpg"}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded-xl shadow-md border border-white/50"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg mb-1">
                            {product.title}
                          </h4>
                          <p className="text-sm text-gray-600 font-medium">
                            Quantity: {product.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-xl">
                            {formatPrice(product.price * product.quantity)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => navigate("/myaccount")}
                          className="bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          View Your Orders
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Shipping Information
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Address:</span>
                  <br />
                  {order.address || "Not provided"}
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Email:</span>{" "}
                  {order.email || "Not provided"}
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Phone:</span>{" "}
                  {order.phone || "Not provided"}
                </p>
                <p className="text-gray-700 font-medium mt-4 text-lg">
                  {order.name || "Customer"}
                </p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Payment Information
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Method:</span> Credit Card
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Order Date:</span>{" "}
                  {formatDate(order.createdAt)}
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      getShippingStatus(order) === 3
                        ? "bg-green-100 text-green-800"
                        : getShippingStatus(order) === 2
                        ? "bg-blue-100 text-blue-800"
                        : getShippingStatus(order) === 1
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {shippingStatusLabel(getShippingStatus(order))}
                  </span>
                </p>
                <p className="text-gray-700 font-medium text-lg">
                  <span className="text-gray-500">Total Paid:</span>{" "}
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Order Tracking
              </h3>

              <div className="space-y-4">
                {(() => {
                  const current = getShippingStatus(order);
                  const steps = [
                    { key: 0, label: "Pending", date: order.createdAt },
                    { key: 1, label: "Processing", date: order.processingAt },
                    { key: 2, label: "Shipped", date: order.shippedAt },
                    {
                      key: 3,
                      label: "Delivered",
                      date:
                        order.deliveredAt ||
                        (current === 3 ? order.updatedAt : null),
                    },
                  ];

                  return steps.map((s) => {
                    const done = current >= s.key;
                    const isCurrent = current === s.key;
                    return (
                      <div
                        key={s.key}
                        className="flex items-start justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                              done
                                ? "bg-green-100 border-green-200 text-green-700"
                                : isCurrent
                                ? "bg-yellow-100 border-yellow-200 text-yellow-700"
                                : "bg-gray-100 border-gray-200 text-gray-500"
                            }`}
                          >
                            {done ? (
                              <FaCheckCircle className="text-lg" />
                            ) : (
                              <span className="text-sm font-bold">
                                {s.key + 1}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-800 font-semibold">
                              {s.label}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {done ? formatMaybeDate(s.date) : "—"}
                            </p>
                          </div>
                        </div>

                        {isCurrent && current !== 3 && (
                          <div className="text-gray-500 text-sm flex items-center gap-2">
                            <FaSpinner className="animate-spin" />
                            <span>In progress</span>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {(order.trackingCarrier || order.trackingNumber) && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 font-medium">
                    <span className="text-gray-500">Courier:</span>{" "}
                    {order.trackingCarrier || "—"}
                  </p>
                  <p className="text-gray-700 font-medium">
                    <span className="text-gray-500">Tracking #:</span>{" "}
                    {order.trackingNumber || "—"}
                  </p>
                </div>
              )}
            </div>

            {/* Order Total */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Order Total
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-gray-800 font-semibold">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Shipping:</span>
                  <span className="text-gray-800 font-semibold">₦ 1,500</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3 mt-3">
                  <span className="text-gray-900 font-bold text-lg">
                    Total:
                  </span>
                  <span className="font-bold text-2xl bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(order.total + 1500)}
                  </span>
                </div>
              </div>
            </div>

            {/* View Your Orders Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => navigate("/myaccount")}
                className="bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg w-full"
              >
                View Your Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
