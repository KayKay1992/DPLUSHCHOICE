/**
 * Resolves a product image to a full URL.
 *
 * - If img is already an absolute URL (Cloudinary, etc.) → return as-is
 * - If img is a relative path (multer upload) → prepend backend origin
 * - If img is empty → return placeholder
 *
 * Backend origin is driven by VITE_API_BASE_URL so it works in both
 * local dev (http://localhost:8000) and production (Render URL).
 */
const BACKEND_ORIGIN = import.meta.env.VITE_API_BASE_URL
  ? new URL(import.meta.env.VITE_API_BASE_URL).origin
  : "http://localhost:8000";

const getImgUrl = (img) => {
  if (!img) return "/placeholder.jpg";
  if (img.startsWith("http")) return img;
  return `${BACKEND_ORIGIN}/${img}`;
};

export default getImgUrl;
