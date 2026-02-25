import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { userRequest } from "./requestMethods";

const clientUrl = import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";

const isAdminRole = (role) => {
  const r = String(role || "")
    .trim()
    .toLowerCase();
  return (
    r === "admin" || r === "staff" || r === "super-admin" || r === "superadmin"
  );
};

const bootstrap = async () => {
  try {
    const res = await userRequest.get("/auth/me");
    // Only redirect if we got a response and it's clearly not an admin
    if (res.data && !isAdminRole(res.data?.role)) {
      window.location.replace(clientUrl);
      return;
    }
  } catch (e) {
    // Network error or not logged in — let the app load and
    // the route loader will handle auth checking per page
    console.warn("Auth bootstrap check failed, continuing to app:", e?.message);
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

bootstrap();
