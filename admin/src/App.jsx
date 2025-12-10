import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Menu from "./components/Menu";
import Users from "./pages/Users";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Banners from "./pages/Banners";
import NewProduct from "./pages/NewProduct";
import Product from "./pages/Product";
const App = () => {
  const Layout = () => {
    return (
      <div className="flex min-h-screen">
        <div className="shrink-0">
          <Menu />
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
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
          element: <NewProduct/>,
        },
        {
          path: "/product/:id",
          element: <Product/>,
        }
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
