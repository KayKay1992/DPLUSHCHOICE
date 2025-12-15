import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import StarRating from "../components/StarRating";
import { userRequest } from "../requestMethods";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await userRequest.get(`/products/find/${productId}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        setError("Product not found");
        setLoading(false);
      }
    };
    fetchProduct();
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

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
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
                  <StarRating rating={4} starSize={24} />
                  <span className="ml-2 text-gray-600">(2 reviews)</span>
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
                  {product.originalPrice &&
                    product.originalPrice !== product.discountPrice && (
                      <span className="text-lg text-gray-500 line-through mr-4">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">
                    {formatPrice(
                      product.discountPrice || product.originalPrice
                    )}
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  {product.inStock
                    ? `In Stock (${product.stock || 50} available)`
                    : "Out of Stock"}
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
                <div className="inline-flex items-center bg-linear-to-r from-pink-400 to-purple-400 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md mb-6">
                  Wholesale Price: {formatPrice(product.wholesalePrice)} per
                  unit (min. {product.wholesaleMinimumQuantity} units)
                </div>
              )}
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <FaMinus />
                </button>
                <span className="text-lg font-semibold mx-4 px-4 py-2 bg-gray-100 rounded-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <FaPlus />
                </button>
              </div>
              <button className="w-full lg:w-3/4 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-8">
                Add to Cart
              </button>
            </div>

            <div>
              <hr className="my-6" />
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Customer Reviews
                </h2>
                {product.ratings && product.ratings.length > 0 ? (
                  product.ratings.map((rating, index) => (
                    <div
                      key={index}
                      className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {rating.name || "Anonymous"}
                        </span>
                        <StarRating
                          rating={parseInt(rating.star) || 5}
                          starSize={16}
                        />
                      </div>
                      <p className="text-gray-700">{rating.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
