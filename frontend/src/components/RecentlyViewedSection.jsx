import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../requestMethods";
import Product from "./Product";
import { getRecentlyViewedIds } from "../utils/recentlyViewedStorage";
import getImgUrl from "../utils/getImgUrl";

const RecentlyViewedSection = ({ excludeId, limit = 8 }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const ids = useMemo(() => {
    const all = getRecentlyViewedIds();
    const filtered = excludeId
      ? all.filter((id) => String(id) !== String(excludeId))
      : all;
    return filtered.slice(0, Number(limit) > 0 ? Number(limit) : 8);
  }, [excludeId, limit]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (ids.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await userRequest.get(`/products/find/${id}`);
              return res.data;
            } catch {
              return null;
            }
          })
        );

        if (!cancelled) {
          setItems(results.filter(Boolean));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [ids.join("|")]);

  if (ids.length === 0) return null;

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading recently viewed...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => (
              <Product
                key={product._id}
                productId={product._id}
                product={product}
                imageFit="cover"
                img={getImgUrl(product.img)}
                name={product.title}
                price={product.discountPrice || product.originalPrice}
                category={
                  product.categories ? product.categories[0] : "general"
                }
                rating={0}
                reviewCount={0}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-600">No recently viewed products.</div>
        )}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
