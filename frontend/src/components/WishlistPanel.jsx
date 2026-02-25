import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { userRequest } from "../requestMethods";
import getImgUrl from "../utils/getImgUrl";
import {
  getWishlistIds,
  removeWishlistId,
  setWishlistIds,
} from "../utils/wishlistStorage";
import { useSelector } from "react-redux";

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const WishlistPanel = ({ embedded = false }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const isLoggedIn = Boolean(currentUser?._id);

  const title = embedded ? null : (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
        My Wishlist
      </h1>
      <p className="text-gray-600">Products you saved for later</p>
    </div>
  );

  const emptyState = useMemo(() => {
    if (loading) return null;
    if (items.length > 0) return null;

    return (
      <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/30">
        <div className="mx-auto w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
          <FaRegHeart className="text-2xl text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Browse products and tap the heart icon to save items.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-xl"
        >
          Continue shopping
        </button>
      </div>
    );
  }, [embedded, items.length, loading, navigate]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await userRequest.get(`/users/${currentUser._id}/wishlist`);
        const wishlist = Array.isArray(res.data?.wishlist)
          ? res.data.wishlist
          : [];
        setWishlistIds(wishlist.map((p) => p?._id).filter(Boolean));
        setItems(wishlist);
      } else {
        const ids = getWishlistIds();
        if (ids.length === 0) {
          setItems([]);
        } else {
          const results = await Promise.allSettled(
            ids.map((id) => userRequest.get(`/products/find/${id}`))
          );
          const products = results
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value?.data)
            .filter(Boolean);
          setItems(products);
        }
      }
    } catch (e) {
      console.log(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  const handleRemove = async (productId) => {
    try {
      if (isLoggedIn) {
        await userRequest.delete(
          `/users/${currentUser._id}/wishlist/${productId}`
        );
      }
      removeWishlistId(productId);
      setItems((prev) =>
        prev.filter((p) => String(p?._id) !== String(productId))
      );
      toast.success("Removed from wishlist");
    } catch (e) {
      console.log(e);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div
      className={
        embedded
          ? ""
          : "min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8"
      }
    >
      <div className={embedded ? "" : "max-w-7xl mx-auto"}>
        {title}

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wishlist…</p>
          </div>
        ) : (
          emptyState || (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => {
                const id = p?._id;
                const img = getImgUrl(p?.img);
                const price =
                  p?.discountPrice || p?.originalPrice || p?.price || 0;

                return (
                  <div
                    key={id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden"
                  >
                    <Link to={`/product/${id}`} className="block">
                      <div className="relative h-56 w-full overflow-hidden">
                        <img
                          src={img}
                          alt={p?.title || "Product"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                      </div>
                    </Link>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                            {p?.title || "Product"}
                          </h3>
                          <p className="mt-2 text-xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">
                            {formatPrice(price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(id)}
                          className="shrink-0 w-11 h-11 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center transition"
                          title="Remove"
                        >
                          <FaHeart />
                        </button>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <Link
                          to={`/product/${id}`}
                          className="flex-1 text-center bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-4 py-3 rounded-full transition-all duration-300 shadow-md"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(id)}
                          className="px-5 py-3 rounded-full border border-pink-200 text-pink-700 hover:bg-pink-50 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default WishlistPanel;
