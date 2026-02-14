const getClientIp = (req) => {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) return xf.split(",")[0].trim();
  return req.ip || req.connection?.remoteAddress || "unknown";
};

/**
 * Simple in-memory rate limiter.
 * Note: resets on server restart; good enough for dev/small deployments.
 */
const rateLimit = ({
  windowMs = 60_000,
  max = 30,
  keyGenerator,
  message = "Too many requests. Please try again shortly.",
} = {}) => {
  const hits = new Map();

  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of hits.entries()) {
      if (!entry || now > entry.resetAt) hits.delete(key);
    }
  };

  return (req, res, next) => {
    cleanup();

    const key =
      typeof keyGenerator === "function"
        ? keyGenerator(req)
        : `${getClientIp(req)}:${req.baseUrl}${req.path}`;

    const now = Date.now();
    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    const remaining = Math.max(0, max - entry.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      return res.status(429).json({ message });
    }

    return next();
  };
};

export default rateLimit;
