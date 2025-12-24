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
    if (!isAdminRole(res.data?.role)) {
      window.location.replace(clientUrl);
      return;
    }
  } catch (e) {
    window.location.replace(clientUrl);
    return;
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

bootstrap();
