import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaSignOutAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, loginSuccess } from "../redux/userRedux";
import { clearUserCart, setCurrentUser } from "../redux/cartRedux";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updating, setUpdating] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchOrders();

    // Initialize form data with current user info
    setFormData({
      name: currentUser.name || currentUser.username || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [currentUser, navigate]);

  const fetchOrders = async () => {
    console.log("Fetching orders for user:", currentUser._id);
    try {
      const res = await userRequest.get(`/orders/find/${currentUser._id}`);
      console.log("Orders response:", res.data);
      setOrders(res.data);
    } catch (error) {
      console.log("Error fetching orders:", error);
      console.log("Error response:", error.response);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setCurrentUser(null));
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to current user values
    setFormData({
      name: currentUser.name || currentUser.username || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }
    }

    setUpdating(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }

      const res = await userRequest.put(
        `/users/${currentUser._id}`,
        updateData
      );
      if (res.data.updatedUser) {
        // Update Redux state with new user data
        dispatch(loginSuccess(res.data.updatedUser));
        setIsEditing(false);
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
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
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Account
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account and view your order history
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 sticky top-24">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-linear-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <FaUser className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {currentUser.name || currentUser.username || "User"}
                </h3>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === "profile"
                      ? "bg-pink-100 text-pink-700 shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaUser className="text-lg" />
                  <span className="font-medium">Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === "orders"
                      ? "bg-pink-100 text-pink-700 shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaShoppingBag className="text-lg" />
                  <span className="font-medium">Orders</span>
                  {orders.length > 0 && (
                    <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {isEditing ? "Edit Profile" : "Profile Information"}
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center space-x-2 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaEdit className="text-lg" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300"
                            placeholder="Enter your phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300 resize-none"
                            placeholder="Enter your address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Change Password (Optional)
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300"
                            placeholder="Enter current password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300"
                            placeholder="Enter new password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Leave password fields empty if you don't want to change
                        your password.
                      </p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300"
                        disabled={updating}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={updating}
                        className="flex items-center space-x-2 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <FaEdit className="text-lg" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <FaUser className="text-pink-600 text-xl" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-semibold text-gray-800">
                              {currentUser.name ||
                                currentUser.username ||
                                "Not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <FaEnvelope className="text-pink-600 text-xl" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Email Address
                            </p>
                            <p className="font-semibold text-gray-800">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <FaPhone className="text-pink-600 text-xl" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Phone Number
                            </p>
                            <p className="font-semibold text-gray-800">
                              {currentUser.phone || "Not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <FaMapMarkerAlt className="text-pink-600 text-xl" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-semibold text-gray-800">
                              {currentUser.address || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleEditProfile}
                        className="flex items-center space-x-2 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <FaEdit className="text-lg" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
                  <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    Order History
                  </h2>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Start shopping to see your order history here
                      </p>
                      <button
                        onClick={() => navigate("/")}
                        className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Order #{order._id.slice(-8)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Placed on {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="mt-2 lg:mt-0">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  order.status === 1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status === 1 ? "Completed" : "Pending"}
                              </span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Items
                              </p>
                              <p className="font-semibold text-gray-800">
                                {order.products?.length || 0} item
                                {order.products?.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Total
                              </p>
                              <p className="font-bold text-lg text-pink-600">
                                {formatPrice(order.total)}
                              </p>
                            </div>
                          </div>

                          {order.products && order.products.length > 0 && (
                            <div className="border-t border-gray-200 pt-4">
                              <p className="text-sm text-gray-500 mb-2">
                                Items:
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {order.products
                                  .slice(0, 4)
                                  .map((product, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 min-w-0"
                                    >
                                      <img
                                        src={product.img}
                                        alt={product.title}
                                        className="w-10 h-10 object-cover rounded-md shrink-0"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-800 truncate">
                                          {product.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Qty: {product.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                {order.products.length > 4 && (
                                  <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 w-10 h-10">
                                    <span className="text-sm font-medium text-gray-600">
                                      +{order.products.length - 4}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
