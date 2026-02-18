import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import MyAccount from "./pages/MyAccount";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Announcement from "./components/Announcement";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import Order from "./pages/Order";
import PaystackCallback from "./pages/PaystackCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./pages/Wishlist";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./redux/cartRedux";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // Initialize cart user on app load
  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser));
    } else {
      dispatch(setCurrentUser(null)); // Set to guest
    }
  }, [currentUser, dispatch]);

  const Layout = () => {
    return (
      <>
        <Announcement />
        <Navbar />
        <Outlet />
        <Footer />
      </>
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
          path: "/cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "/myaccount",
          element: (
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          ),
        },
        {
          path: "/product/:productId",
          element: <ProductDetails />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/products",
          element: <ProductList />,
        },
        {
          path: "/products/category/:category",
          element: <ProductList />,
        },
        {
          path: "/products/:searchTerm",
          element: <ProductList />,
        },
        {
          path: "/wishlist",
          element: <Wishlist />,
        },
        {
          path: "/myorders",
          element: (
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          ),
        },
        {
          path: "/myorders/:orderId",
          element: (
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          ),
        },
        {
          path: "/paystack/callback",
          element: (
            <ProtectedRoute>
              <PaystackCallback />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
