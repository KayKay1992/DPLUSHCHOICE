import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1";

const isGeminiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

let cachedGeminiModels = { fetchedAt: 0, models: [] };

let geminiCircuit = { blockedUntil: 0, reason: "" };

const normalizeGeminiModelName = (model) => {
  const m = String(model || "").trim();
  if (!m) return "";
  return m.startsWith("models/") ? m : `models/${m}`;
};

const listGeminiModels = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `${GEMINI_BASE_URL}/models`;
  const response = await axios.get(url, {
    timeout: 20000,
    headers: {
      "x-goog-api-key": apiKey,
    },
  });
  return Array.isArray(response?.data?.models) ? response.data.models : [];
};

const pickBestGeminiModel = (models) => {
  const supportsGenerateContent = (m) =>
    Array.isArray(m?.supportedGenerationMethods)
      ? m.supportedGenerationMethods.includes("generateContent")
      : true;

  const candidates = models
    .filter((m) => typeof m?.name === "string" && supportsGenerateContent(m))
    .map((m) => m.name);

  const preference = [
    "models/gemini-2.5-flash",
    "models/gemini-2.0-flash",
    "models/gemini-2.0-flash-001",
    "models/gemini-2.0-flash-lite-001",
    "models/gemini-2.5-pro",
  ];

  for (const p of preference) {
    if (candidates.includes(p)) return p;
  }

  const flash = candidates.find((n) => n.includes("flash"));
  return flash || candidates[0] || "";
};

const isGeminiTemporarilyBlocked = () =>
  Date.now() < (geminiCircuit.blockedUntil || 0);

const blockGeminiTemporarily = ({ reason, minutes = 10 } = {}) => {
  geminiCircuit = {
    blockedUntil: Date.now() + minutes * 60 * 1000,
    reason: String(reason || "Gemini temporarily unavailable"),
  };
};

const buildFallbackDescription = ({ title } = {}) => {
  const t = String(title || "").trim() || "this product";
  return (
    `Short: ${t} — a stylish everyday pick for gifting or personal use.\n\n` +
    `Detailed: We don’t have enough AI quota right now to generate an enhanced description from the image, ` +
    `so this is a safe, generic description based on the title only. ` +
    `If you share key details (material, size, color, brand, what’s in the box), I can refine it instantly.\n\n` +
    `Highlights:\n` +
    `- Suitable for gifting and daily use\n` +
    `- Simple, clean presentation\n` +
    `- Ask for available colors/variants\n` +
    `- Confirm size/measurements before purchase\n` +
    `- Check delivery timeline and return policy`
  );
};

const buildFallbackChatReply = ({ message, context, sellerExtracts } = {}) => {
  const msg = String(message || "").trim();
  const p = context?.type === "product" ? context.product || {} : {};
  const title = String(p?.title || "this product").trim() || "this product";
  const hasDesc = String(p?.desc || "").trim().length > 0;
  const price = p?.discountPrice ?? p?.originalPrice;
  const currency = p?.currency || "NGN";

  const lines = [];
  lines.push(
    "AI is temporarily unavailable (Gemini quota/project issue). Here’s what I can safely tell you from your product data:"
  );
  lines.push(`- Product: ${title}`);
  if (typeof price === "number") lines.push(`- Price: ${currency} ${price}`);
  if (Array.isArray(p?.categories) && p.categories.length > 0) {
    lines.push(`- Category: ${p.categories.join(", ")}`);
  }
  if (hasDesc)
    lines.push(
      `- Description on record: ${String(p.desc).slice(0, 200)}${
        String(p.desc).length > 200 ? "…" : ""
      }`
    );

  const lower = msg.toLowerCase();
  const askingQuality =
    /quality|durable|durability|original|authentic|material|stitch|zip|clasp/i.test(
      lower
    );
  const askingDelivery =
    /delivery|shipping|when|how long|lagos|abuja|dispatch/i.test(lower);
  const askingGift =
    /gift|gifting|present|birthday|anniversary|valentine/i.test(lower);

  if (
    sellerExtracts &&
    Array.isArray(sellerExtracts) &&
    sellerExtracts.length > 0
  ) {
    lines.push(
      "\nWhat other sellers mention (summarized from the links you provided):"
    );
    for (const s of sellerExtracts.slice(0, 3)) {
      const bits = [s?.pageTitle, s?.metaDescription]
        .filter(Boolean)
        .join(" — ")
        .trim();
      lines.push(`- ${s?.url}: ${bits || "(No clear summary text found)"}`);
    }
    lines.push(
      "Note: This is a paraphrased summary (not copied). Always verify details on the seller page."
    );
  } else if (
    /other\s+sellers|different\s+sellers|what\s+others\s+say|compare|comparison|net|internet|online/i.test(
      lower
    )
  ) {
    lines.push(
      "\nTo summarize what other sellers say, paste 1–3 product links, OR enable title-based web search (AI_SEARCH_PROVIDER=serpapi + SERPAPI_API_KEY + AI_SELLER_ALLOW_* allowlist)."
    );
  }

  if (askingQuality) {
    lines.push(
      "\nQuality guidance (since material/craft details may be missing):"
    );
    lines.push(
      "- Tell me the material (PU/faux leather/genuine leather/satin/etc) and closure type (zip/clasp/magnet)."
    );
    lines.push(
      "- In general, good clutches have even stitching, firm structure, smooth hardware, and clean lining."
    );
  }
  if (askingDelivery) {
    lines.push(
      "\nDelivery: I can explain delivery options if you tell me your city/state and preferred delivery date."
    );
  }
  if (askingGift) {
    lines.push(
      "\nGifting: Tell me the recipient (age/style) and occasion; I’ll recommend color/style and a gift note."
    );
  }

  lines.push(
    "\nIf you fix the Gemini quota, the AI can also use the product image for richer details."
  );
  return lines.join("\n");
};

// --- Helper functions ---

const isDisallowedPrompt = (text) => {
  const t = String(text || "").toLowerCase();
  const blocked = [
    "hack",
    "steal",
    "credit card",
    "cvv",
    "bank",
    "otp",
    "password",
    "exploit",
    "malware",
    "weapon",
    "porn",
  ];
  return blocked.some((w) => t.includes(w));
};

const extractUrls = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v || "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\s+/)
      .map((v) => v.trim())
      .filter((v) => v.startsWith("http://") || v.startsWith("https://"));
  }
  return [];
};

const isPrivateIpHost = (hostname) => {
  const host = String(hostname || "").trim();
  // Basic IPv4 private ranges (blocks SSRF-ish URLs if someone tries an IP)
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return false;
  const parts = host.split(".").map((n) => Number(n));
  if (parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
};

const isAllowedSellerUrl = (rawUrl) => {
  try {
    const u = new URL(String(rawUrl));
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (!u.hostname) return false;
    if (isPrivateIpHost(u.hostname)) return false;

    const allowOrigins = String(process.env.AI_SELLER_ALLOW_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const allowDomains = String(process.env.AI_SELLER_ALLOW_DOMAINS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    // Safety default: allowlist required
    if (allowOrigins.length === 0 && allowDomains.length === 0) return false;

    if (allowOrigins.length > 0 && allowOrigins.includes(u.origin)) return true;

    if (allowDomains.length > 0) {
      const host = String(u.hostname || "").toLowerCase();
      return allowDomains.some((d) => host === d || host.endsWith(`.${d}`));
    }

    return false;
  } catch {
    return false;
  }
};

const isSearchConfigured = () => {
  const provider = String(process.env.AI_SEARCH_PROVIDER || "")
    .trim()
    .toLowerCase();
  if (!provider) return false;
  if (provider === "serpapi") return Boolean(process.env.SERPAPI_API_KEY);
  return false;
};

const isSellerAllowlistConfigured = () => {
  const origins = String(process.env.AI_SELLER_ALLOW_ORIGINS || "").trim();
  const domains = String(process.env.AI_SELLER_ALLOW_DOMAINS || "").trim();
  return Boolean(origins || domains);
};

const normalizeSearchTitle = (title) =>
  String(title || "")
    .replace(/\s+/g, " ")
    .trim();

const searchSellerUrlsByTitle = async (title) => {
  const provider = String(process.env.AI_SEARCH_PROVIDER || "")
    .trim()
    .toLowerCase();
  const t = normalizeSearchTitle(title);
  if (!t) return [];
  if (provider !== "serpapi") return [];
  if (!process.env.SERPAPI_API_KEY) return [];

  const query = `${t} product price description`;

  const res = await axios.get("https://serpapi.com/search.json", {
    timeout: 15000,
    params: {
      engine: "google",
      q: query,
      num: 10,
      api_key: process.env.SERPAPI_API_KEY,
    },
    validateStatus: (s) => s >= 200 && s < 300,
  });

  const organic = Array.isArray(res?.data?.organic_results)
    ? res.data.organic_results
    : [];

  const urls = [];
  for (const r of organic) {
    const link = String(r?.link || "").trim();
    if (!link) continue;
    if (!isAllowedSellerUrl(link)) continue;
    urls.push(link);
  }

  return Array.from(new Set(urls)).slice(0, 3);
};

const stripHtmlToText = (html) => {
  const s = String(html || "");
  const withoutScripts = s
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  const text = withoutScripts
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  return text;
};

const extractHtmlTitle = (html) => {
  const m = String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? stripHtmlToText(m[1]) : "";
};

const extractMetaDescription = (html) => {
  const s = String(html || "");
  // name="description" or property="og:description"
  const m1 = s.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  if (m1) return stripHtmlToText(m1[1]);
  const m2 = s.match(
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  if (m2) return stripHtmlToText(m2[1]);
  return "";
};

const fetchSellerPageExtract = async (rawUrl) => {
  if (!isAllowedSellerUrl(rawUrl)) {
    const err = new Error(
      "Seller URL is not allowed. Add its origin to AI_SELLER_ALLOW_ORIGINS"
    );
    err.code = "SELLER_URL_NOT_ALLOWED";
    throw err;
  }

  const res = await axios.get(rawUrl, {
    timeout: 15000,
    responseType: "text",
    maxContentLength: 1024 * 1024,
    maxBodyLength: 1024 * 1024,
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; DplushChoiceBot/1.0)",
      accept: "text/html,application/xhtml+xml",
    },
    validateStatus: (s) => s >= 200 && s < 300,
  });

  const html = String(res?.data || "");
  const title = extractHtmlTitle(html);
  const description = extractMetaDescription(html);
  const text = stripHtmlToText(html);

  // Keep very small to reduce copying risk + token bloat.
  const snippet = text.slice(0, 1400);

  return {
    url: rawUrl,
    pageTitle: title,
    metaDescription: description,
    snippet,
  };
};

const hasProductContext = (context) => {
  if (!context || typeof context !== "object") return false;
  if (context.type === "product") {
    return Boolean(context.product?.title || context.product?._id);
  }
  if (context.type === "cart") {
    return Array.isArray(context.items) && context.items.length > 0;
  }
  return false;
};

const getProductImageUrlsFromContext = (context) => {
  if (!context || typeof context !== "object") return [];

  if (context.type === "product") {
    const p = context.product || {};
    const urls = [];
    if (Array.isArray(p.images)) urls.push(...p.images);
    if (typeof p.img === "string") urls.push(p.img);
    if (typeof p.image === "string") urls.push(p.image);
    return urls
      .map((u) => String(u || "").trim())
      .filter(Boolean)
      .slice(0, 2);
  }

  if (context.type === "cart") {
    const items = Array.isArray(context.items) ? context.items : [];
    const urls = [];
    for (const item of items) {
      if (typeof item?.img === "string") urls.push(item.img);
      if (typeof item?.image === "string") urls.push(item.image);
      if (Array.isArray(item?.images)) urls.push(...item.images);
    }
    return urls
      .map((u) => String(u || "").trim())
      .filter(Boolean)
      .slice(0, 2);
  }

  return [];
};

const isAllowedImageUrl = (rawUrl) => {
  try {
    const u = new URL(String(rawUrl));
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;

    const host = (u.hostname || "").toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (host.endsWith(".cloudinary.com") || host === "cloudinary.com")
      return true;

    const allow = String(process.env.AI_IMAGE_ALLOW_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (allow.length === 0) return false;
    return allow.includes(u.origin);
  } catch {
    return false;
  }
};

const normalizeImageUrl = (rawUrl) => {
  const u = String(rawUrl || "").trim();
  if (!u) return "";

  // If the frontend stored a relative uploads path, resolve to backend public URL.
  if (u.startsWith("/uploads/") || u.startsWith("uploads/")) {
    const base =
      String(process.env.PUBLIC_SERVER_URL || "").trim() ||
      `http://localhost:${process.env.PORT || 8000}`;
    const path = u.startsWith("/") ? u : `/${u}`;
    return `${base}${path}`;
  }

  return u;
};

const fetchImageAsInlineDataPart = async (rawUrl) => {
  const url = normalizeImageUrl(rawUrl);
  if (!url) return null;
  if (!isAllowedImageUrl(url)) return null;

  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 20000,
    maxContentLength: 5 * 1024 * 1024,
    maxBodyLength: 5 * 1024 * 1024,
    validateStatus: (s) => s >= 200 && s < 300,
  });

  const contentType = String(res?.headers?.["content-type"] || "")
    .split(";")[0]
    .trim();
  const mimeType = contentType || "image/jpeg";
  const data = Buffer.from(res.data).toString("base64");

  // Gemini REST expects inline_data with mime_type + base64 data
  return {
    inline_data: {
      mime_type: mimeType,
      data,
    },
  };
};

const shouldAttachProductImage = (message, context) => {
  const text = String(message || "").toLowerCase();
  const desc = String(context?.product?.desc || "").trim();
  const descTooThin = desc.length < 30;

  const triggers = [
    "describe",
    "description",
    "what is this",
    "how does it look",
    "looks like",
    "color",
    "material",
    "quality",
    "durable",
    "authentic",
    "original",
    "size",
    "clutch",
    "purse",
    "bag",
  ];

  if (triggers.some((t) => text.includes(t))) return true;
  if (context?.type === "product" && descTooThin) return true;
  return false;
};

const isLikelyProductRelated = (message, context) => {
  if (hasProductContext(context)) return true;

  const t = String(message || "").toLowerCase();
  const keywords = [
    "product",
    "price",
    "discount",
    "stock",
    "size",
    "material",
    "ingredients",
    "how to use",
    "usage",
    "recommend",
    "gift",
    "perfume",
    "shipping",
    "delivery",
    "quality",
    "durable",
    "durability",
    "original",
    "authentic",
    "warranty",
    "return",
    "refund",
    "exchange",
    "compare",
    "comparison",
    "other sellers",
    "seller",
    "vendors",
    "marketplace",
  ];
  return keywords.some((k) => t.includes(k));
};

const buildSystemPrompt = (context) => {
  const ctx = context && typeof context === "object" ? context : {};
  return (
    "You are an e-commerce product assistant for a shop. " +
    "You MUST only answer questions related to the provided product/cart context: product details, materials/ingredients, usage, gifting, size, price, stock, shipping/delivery, returns, and choosing between products. " +
    "If the user asks anything unrelated to shopping/products, refuse briefly and ask them to rephrase as a product-related question.\n\n" +
    "CRITICAL: Be evidence-based. Use ONLY the facts present in the Context JSON and the user's message. " +
    "Do NOT invent or assume missing specifics (materials, brand, measurements, warranty, craftsmanship, authenticity, delivery promises, etc.).\n" +
    "If product images are provided, you MAY infer visible attributes (color, shape, approximate style) but phrase them as observations (e.g., 'It appears to be...').\n" +
    "If external seller page extracts are provided, you may summarize what they CLAIM/mention, but you MUST NOT copy their wording. " +
    "Do not quote long passages. Keep any direct quotes under 20 words, and prefer paraphrase.\n" +
    "If the user asks for something that requires missing details (e.g., 'quality' but materials aren't listed), do this order:\n" +
    "1) State clearly what you can and cannot confirm from the current product info.\n" +
    "2) Ask 3-5 short clarifying questions to collect the missing info.\n" +
    "3) Provide general guidance and a quick checklist (phrased as 'In general...' / 'Typically...') that helps the user decide even before answering questions.\n" +
    "Keep it practical for shopping decisions (what to look for, how to verify, what to ask, return policy considerations).\n\n" +
    "Context (JSON):\n" +
    JSON.stringify(ctx)
  );
};

// --- Call Gemini REST API (API key) ---
const callGemini = async ({ message, context, mediaParts = [] }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const configuredModel = normalizeGeminiModelName(process.env.GEMINI_MODEL);

  const now = Date.now();
  const cacheTtlMs = 10 * 60 * 1000;
  if (now - cachedGeminiModels.fetchedAt > cacheTtlMs) {
    const models = await listGeminiModels();
    cachedGeminiModels = { fetchedAt: now, models };
  }

  const availableNames = new Set(
    (cachedGeminiModels.models || [])
      .map((m) => m?.name)
      .filter((n) => typeof n === "string")
  );

  const discoveredModel = pickBestGeminiModel(cachedGeminiModels.models);
  const modelName =
    configuredModel && availableNames.has(configuredModel)
      ? configuredModel
      : discoveredModel;

  if (!modelName) {
    const err = new Error("No Gemini model available for generateContent");
    err.code = "NO_GEMINI_MODEL";
    throw err;
  }

  const url = `${GEMINI_BASE_URL}/${encodeURI(modelName)}:generateContent`;
  const prompt = `${buildSystemPrompt(context)}\n\nUser: ${message}`;

  const parts = [
    { text: prompt },
    ...(Array.isArray(mediaParts) ? mediaParts : []),
  ];

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      generationConfig: {
        temperature: 0.25,
      },
    },
    {
      timeout: 20000,
      headers: {
        "x-goog-api-key": apiKey,
      },
    }
  );

  const reply =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    response?.data?.candidates?.[0]?.content?.parts
      ?.map((p) => p?.text)
      .join("\n") ||
    "";

  return { reply, modelUsed: modelName };
};

// --- Public endpoints ---

// Product description generator
export const generateDescription = async (req, res) => {
  const { title, imageUrl: bodyImageUrl } = req.body;
  const file = req.file;

  if (!title) {
    return res.status(400).json({ error: "Product title is required" });
  }

  // If we have an uploaded file, prefer that. Otherwise accept a URL.
  let mediaParts = [];
  if (file?.buffer && file?.mimetype) {
    mediaParts = [
      {
        inline_data: {
          mime_type: file.mimetype,
          data: Buffer.from(file.buffer).toString("base64"),
        },
      },
    ];
  } else if (bodyImageUrl) {
    try {
      const part = await fetchImageAsInlineDataPart(bodyImageUrl);
      if (part) mediaParts = [part];
    } catch {
      // ignore image failures; fall back to text-only
      mediaParts = [];
    }
  }

  const prompt =
    `Write a high-quality e-commerce product description for the product titled "${title}". ` +
    "Use the provided image (if available) to infer visible attributes like color, shape, and style, but do not guess brand, material, dimensions, or guarantees if not visible. " +
    "Output: 1 short description (1-2 sentences), 1 detailed description (4-6 sentences), and 5 bullet highlights. " +
    "If something important is unknown, avoid claiming it as fact.";
  try {
    if (!isGeminiConfigured()) {
      return res
        .status(500)
        .json({ error: "AI is not configured (missing GEMINI_API_KEY)" });
    }

    if (isGeminiTemporarilyBlocked()) {
      return res.json({
        description: buildFallbackDescription({ title }),
        modelUsed: "fallback",
        note: geminiCircuit.reason,
      });
    }

    const { reply: description } = await callGemini({
      message: prompt,
      context: { type: "product", product: { title } },
      mediaParts,
    });
    res.json({ description });
  } catch (error) {
    const status = error?.response?.status;
    const apiMessage =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error";

    console.error("[AI_DESCRIPTION_ERROR]", { status, apiMessage });

    const apiText = String(apiMessage || "");
    const isQuotaZero =
      status === 429 &&
      (apiText.includes("limit: 0") ||
        apiText.toLowerCase().includes("current quota"));
    const isExpiredKey =
      status === 400 && apiText.toLowerCase().includes("api key expired");

    if (isQuotaZero) {
      blockGeminiTemporarily({
        reason:
          "Gemini quota appears to be 0 for this project/key. Using fallback until quota is fixed.",
        minutes: 15,
      });
      return res.json({
        description: buildFallbackDescription({ title }),
        modelUsed: "fallback",
        note: "Gemini quota is 0. Fix it in Google AI Studio / Cloud project quotas, then restart the backend.",
      });
    }

    if (isExpiredKey) {
      blockGeminiTemporarily({
        reason: "Gemini API key expired. Using fallback until updated.",
        minutes: 60,
      });
      return res.json({
        description: buildFallbackDescription({ title }),
        modelUsed: "fallback",
        note: "Gemini API key expired. Update GEMINI_API_KEY in Backend/.env and restart the backend.",
      });
    }

    return res.status(Number.isInteger(status) ? status : 500).json({
      error: "Failed to generate description",
      details: apiMessage,
    });
  }
};

// Quick product helper chat
export const productHelperChat = async (req, res) => {
  const message = String(req.body?.message || "").trim();
  const context = req.body?.context;
  const sourceUrls = extractUrls(
    req.body?.sources || context?.sources || context?.product?.sources
  );
  const productTitle =
    context?.type === "product"
      ? String(context?.product?.title || "").trim()
      : "";
  const wantsWeb =
    /other\s+sellers|different\s+sellers|what\s+others\s+say|compare|comparison|net|internet|online/i.test(
      message
    );

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }
  if (message.length > 800) {
    return res
      .status(400)
      .json({ message: "Message is too long (max 800 characters)" });
  }
  if (isDisallowedPrompt(message)) {
    return res.status(400).json({
      message: "Please ask only product/shopping related questions.",
    });
  }
  if (!isLikelyProductRelated(message, context)) {
    return res.status(400).json({
      message:
        "I can only help with product/shopping questions. Please ask about a product (price, usage, gifting, delivery, etc.).",
    });
  }

  try {
    if (!isGeminiConfigured()) {
      return res
        .status(500)
        .json({ message: "AI is not configured (missing GEMINI_API_KEY)" });
    }

    if (isGeminiTemporarilyBlocked()) {
      let sellerExtracts = [];
      const resolvedUrls = [...sourceUrls];

      if (
        resolvedUrls.length === 0 &&
        wantsWeb &&
        productTitle &&
        isSearchConfigured()
      ) {
        try {
          resolvedUrls.push(...(await searchSellerUrlsByTitle(productTitle)));
        } catch {
          // ignore search errors
        }
      }

      if (resolvedUrls.length > 0) {
        try {
          sellerExtracts = await Promise.all(
            resolvedUrls.slice(0, 3).map((u) => fetchSellerPageExtract(u))
          );
        } catch {
          sellerExtracts = [];
        }
      }

      return res.json({
        reply: buildFallbackChatReply({ message, context, sellerExtracts }),
        modelUsed: "fallback",
        note: geminiCircuit.reason,
      });
    }

    // If user asks for "from the net" but we cannot do search (no config), be explicit.
    if (wantsWeb && sourceUrls.length === 0) {
      if (!isSearchConfigured()) {
        return res.json({
          reply:
            "I can summarize what other sellers say, but web-by-title search is not enabled yet. " +
            "Either: (1) paste 1–3 product links from other sellers, OR (2) enable search by setting AI_SEARCH_PROVIDER=serpapi and SERPAPI_API_KEY in Backend/.env. " +
            "Also set AI_SELLER_ALLOW_DOMAINS or AI_SELLER_ALLOW_ORIGINS to allow the sites you want me to fetch.",
          modelUsed: "system",
        });
      }

      if (!isSellerAllowlistConfigured()) {
        return res.json({
          reply:
            "Web-by-title search is enabled, but seller fetch allowlist is empty. " +
            "Set AI_SELLER_ALLOW_DOMAINS (recommended) or AI_SELLER_ALLOW_ORIGINS in Backend/.env, then retry.",
          modelUsed: "system",
        });
      }
    }

    let mediaParts = [];
    if (shouldAttachProductImage(message, context)) {
      const urls = getProductImageUrlsFromContext(context);
      if (urls.length > 0) {
        try {
          const part = await fetchImageAsInlineDataPart(urls[0]);
          if (part) mediaParts = [part];
        } catch {
          mediaParts = [];
        }
      }
    }

    // Optional: include external seller extracts when the user asks for "what other sellers say"
    let sellerExtracts = [];
    const wantsWeb2 =
      /other\s+sellers|different\s+sellers|what\s+others\s+say|compare|comparison|marketplace|net|internet|online/i.test(
        message
      );
    const resolvedUrls = [...sourceUrls];

    if (
      resolvedUrls.length === 0 &&
      wantsWeb2 &&
      productTitle &&
      isSearchConfigured()
    ) {
      try {
        resolvedUrls.push(...(await searchSellerUrlsByTitle(productTitle)));
      } catch {
        // ignore search errors
      }
    }

    if (resolvedUrls.length > 0) {
      const limited = resolvedUrls.slice(0, 3);
      try {
        sellerExtracts = await Promise.all(
          limited.map((u) => fetchSellerPageExtract(u))
        );
      } catch (e) {
        // If seller fetch fails, we still allow normal chat.
        sellerExtracts = [];
      }
    }

    const enrichedContext =
      sellerExtracts.length > 0
        ? {
            ...(context && typeof context === "object" ? context : {}),
            externalSellerExtracts: sellerExtracts,
          }
        : context;

    const needsSourcesHint =
      sellerExtracts.length === 0 &&
      /other\s+sellers|different\s+sellers|what\s+others\s+say|compare|comparison|marketplace|net|internet|online/i.test(
        message
      );

    const messageWithHint = needsSourcesHint
      ? `${message}\n\n(To summarize what other sellers say: paste 1–3 product links, OR set AI_SEARCH_PROVIDER=serpapi + SERPAPI_API_KEY and allowlist domains with AI_SELLER_ALLOW_DOMAINS / AI_SELLER_ALLOW_ORIGINS.)`
      : message;

    const { reply, modelUsed } = await callGemini({
      message: messageWithHint,
      context: enrichedContext,
      mediaParts,
    });

    return res.json({
      reply: reply || "Sorry, I couldn't generate a response.",
      modelUsed,
    });
  } catch (error) {
    const status = error?.response?.status;
    const apiMessage =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error";

    // Graceful UX for quota=0 (common on free tier misconfigured projects)
    const apiText = String(apiMessage || "");
    const isQuotaZero =
      status === 429 &&
      (apiText.includes("limit: 0") ||
        apiText.toLowerCase().includes("current quota"));

    if (isQuotaZero) {
      blockGeminiTemporarily({
        reason:
          "Gemini quota appears to be 0 for this project/key. Using fallback until quota is fixed.",
        minutes: 15,
      });

      let sellerExtracts = [];
      if (sourceUrls.length > 0) {
        try {
          sellerExtracts = await Promise.all(
            sourceUrls.slice(0, 3).map((u) => fetchSellerPageExtract(u))
          );
        } catch {
          sellerExtracts = [];
        }
      }

      return res.status(200).json({
        reply: buildFallbackChatReply({ message, context, sellerExtracts }),
        modelUsed: "fallback",
        note: "Gemini quota is 0. Open https://aistudio.google.com/app/apikey (or https://ai.dev/usage?tab=rate-limit) to check quotas, then use a key/project with non-zero quota and restart the backend.",
      });
    }

    const hint =
      status === 400 && apiText.toLowerCase().includes("api key expired")
        ? "Gemini API key expired. Update GEMINI_API_KEY in Backend/.env and restart the backend."
        : status === 401 || status === 403
        ? `Gemini rejected the API key (${status}).`
        : status === 429
        ? "Gemini rate limit / quota exceeded (429)."
        : Number.isInteger(status)
        ? `Gemini request failed (${status}).`
        : "Gemini request failed.";

    console.error("[AI_CHAT_ERROR]", { status, apiMessage });

    return res.status(Number.isInteger(status) ? status : 500).json({
      message: "Failed to generate AI reply",
      hint,
      details: apiMessage,
    });
  }
};
