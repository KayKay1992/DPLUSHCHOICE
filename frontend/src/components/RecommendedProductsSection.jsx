import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../requestMethods";
import Product from "./Product";

function getProductPrice(p) {
  const v = p?.discountPrice ?? p?.originalPrice;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const RecommendedProductsSection = ({
  currentProduct,
  excludeId,
  limit = 8,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentCategories = useMemo(() => {
    const cats = currentProduct?.categories;
    if (!Array.isArray(cats)) return [];
    return cats.map(String).filter(Boolean);
  }, [currentProduct]);

  const targetPrice = useMemo(
    () => getProductPrice(currentProduct),
    [currentProduct]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!currentProduct) return;

      // If we have no category info, keep it simple: do nothing.
      if (currentCategories.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        // Use backend category filter for fewer results.
        const category = encodeURIComponent(currentCategories[0]);
        const res = await userRequest.get(`/products?category=${category}`);
        const list = Array.isArray(res.data) ? res.data : [];

        const filtered = list
          .filter((p) => p && String(p._id) !== String(excludeId))
          .filter((p) => {
            const cats = Array.isArray(p.categories) ? p.categories : [];
            return cats.some((c) => currentCategories.includes(String(c)));
          })
          .map((p) => {
            const price = getProductPrice(p);
            const diff = Math.abs(price - targetPrice);
            return { p, price, diff };
          })
          // Similar price first
          .sort((a, b) => a.diff - b.diff)
          .slice(0, Number(limit) > 0 ? Number(limit) : 8)
          .map((x) => x.p);

        if (!cancelled) setItems(filtered);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [
    currentProduct,
    excludeId,
    limit,
    currentCategories.join("|"),
    targetPrice,
  ]);

  if (!currentProduct) return null;
  if (currentCategories.length === 0) return null;

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            You may also like
          </h2>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading recommendations...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((p) => (
              <Product
                key={p._id}
                productId={p._id}
                product={p}
                imageFit="cover"
                img={
                  p.img
                    ? p.img.startsWith("http")
                      ? p.img
                      : `http://localhost:8000/${p.img}`
                    : "/placeholder.jpg"
                }
                name={p.title}
                price={p.discountPrice || p.originalPrice}
                category={p.categories ? p.categories[0] : "general"}
                rating={0}
                reviewCount={0}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-600">No recommendations yet.</div>
        )}
      </div>
    </section>
  );
};

export default RecommendedProductsSection;
