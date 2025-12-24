import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Menu from "./components/Menu";
import Users from "./pages/Users";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Banners from "./pages/Banners";
import NewProduct from "./pages/NewProduct";
import Product from "./pages/Product";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { userRequest } from "./requestMethods";
const App = () => {
  const Layout = () => {
    const [authChecked, setAuthChecked] = useState(false);

    const isAdminRole = (role) => {
      const r = String(role || "")
        .trim()
        .toLowerCase();
      return (
        r === "admin" ||
        r === "super-admin" ||
        r === "superadmin" ||
        r === "staff" ||
        r === "moderator"
      );
    };

    useEffect(() => {
      const check = async () => {
        try {
          const res = await userRequest.get("/auth/me");
          if (!isAdminRole(res.data?.role)) {
            const clientUrl =
              import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";
            window.location.replace(clientUrl);
            return;
          }
          setAuthChecked(true);
        } catch (e) {
          const clientUrl =
            import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";
          window.location.replace(`${clientUrl}/login`);
        }
      };

      check();
    }, []);

    if (!authChecked) return null;

    return (
      <div className="flex min-h-screen">
        <div className="shrink-0">
          <Menu />
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/banners",
          element: <Banners />,
        },
        {
          path: "/new-product",
          element: <NewProduct />,
        },
        {
          path: "/product/:id",
          element: <Product />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
