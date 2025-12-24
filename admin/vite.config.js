import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const clientUrl = env.VITE_CLIENT_URL || "http://localhost:5173";
  const apiBase = env.VITE_API_BASE_URL || "http://localhost:8000/api/V1";

  const isAdminRole = (role) => {
    const r = String(role || "")
      .trim()
      .toLowerCase();
    return (
      r === "admin" ||
      r === "staff" ||
      r === "super-admin" ||
      r === "superadmin"
    );
  };

  return {
    plugins: [
      {
        name: "admin-auth-gate",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Only gate real page navigations (HTML document requests)
            const accept = String(req.headers.accept || "");
            const isDocument = accept.includes("text/html");
            if (!isDocument || req.method !== "GET") return next();

            // Allow the redirect endpoint itself
            if (req.url && req.url.startsWith("/__redirect")) return next();

            try {
              const cookie = req.headers.cookie || "";
              const meRes = await fetch(`${apiBase}/auth/me`, {
                method: "GET",
                headers: {
                  cookie,
                  accept: "application/json",
                },
              });

              if (!meRes.ok) {
                res.statusCode = 302;
                res.setHeader("Location", clientUrl);
                return res.end();
              }

              const me = await meRes.json();
              if (!isAdminRole(me?.role)) {
                res.statusCode = 302;
                res.setHeader("Location", clientUrl);
                return res.end();
              }

              return next();
            } catch {
              res.statusCode = 302;
              res.setHeader("Location", clientUrl);
              return res.end();
            }
          });
        },
      },
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5175,
      strictPort: true,
    },
  };
});
