import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import MyAccount from "./pages/MyAccount";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const Layout = () => {
    return (
      <>
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
          element: <Cart />,
        },
        {
          path: "/myaccount",
          element: <MyAccount />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
