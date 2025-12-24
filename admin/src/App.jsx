import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  redirect,
} from "react-router-dom";
import Menu from "./components/Menu";
import Users from "./pages/Users";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Banners from "./pages/Banners";
import NewProduct from "./pages/NewProduct";
import Product from "./pages/Product";
import ExternalRedirect from "./pages/ExternalRedirect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRequest } from "./requestMethods";
const App = () => {
  const clientUrl = import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";

  const isAdminRole = (role) => {
    const r = String(role || "")
      .trim()
      .toLowerCase();
    return r === "admin" || r === "staff" || r === "super-admin" || r === "superadmin";
  };

  const requireAdminLoader = async () => {
    try {
      const res = await userRequest.get("/auth/me");
      if (!isAdminRole(res.data?.role)) throw new Error("not admin");
      return null;
    } catch (e) {
      throw redirect("/__redirect");
    }
  };

  const Layout = () => {
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
      path: "/__redirect",
      element: <ExternalRedirect to={clientUrl} />,
    },
    {
      path: "/",
      element: <Layout />,
      loader: requireAdminLoader,
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
