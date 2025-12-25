const STORAGE_KEY = "recently_viewed_product_ids";
const DEFAULT_MAX = 10;

export function getRecentlyViewedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String).filter(Boolean);
  } catch {
    return [];
  }
}

export function setRecentlyViewedIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function addRecentlyViewedId(productId, maxItems = DEFAULT_MAX) {
  const id = String(productId || "").trim();
  if (!id) return;

  const existing = getRecentlyViewedIds();
  const next = [id, ...existing.filter((x) => String(x) !== id)].slice(
    0,
    Number(maxItems) > 0 ? Number(maxItems) : DEFAULT_MAX
  );
  setRecentlyViewedIds(next);
}

export function clearRecentlyViewedIds() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
