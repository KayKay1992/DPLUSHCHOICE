const KEY = "dpc_wishlist_ids";

export const getWishlistIds = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String);
  } catch {
    return [];
  }
};

export const setWishlistIds = (ids) => {
  const normalized = Array.from(new Set((ids || []).map(String)));
  localStorage.setItem(KEY, JSON.stringify(normalized));
  return normalized;
};

export const isInWishlist = (productId) => {
  const id = String(productId);
  return getWishlistIds().includes(id);
};

export const addWishlistId = (productId) => {
  const ids = getWishlistIds();
  ids.push(String(productId));
  return setWishlistIds(ids);
};

export const removeWishlistId = (productId) => {
  const id = String(productId);
  return setWishlistIds(getWishlistIds().filter((x) => x !== id));
};

export const toggleWishlistId = (productId) => {
  const id = String(productId);
  const ids = getWishlistIds();
  if (ids.includes(id)) {
    return {
      inWishlist: false,
      ids: setWishlistIds(ids.filter((x) => x !== id)),
    };
  }
  return { inWishlist: true, ids: setWishlistIds([...ids, id]) };
};
