import  {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import Menu from './components/Menu'
import Users from './pages/Users'
import Home from './pages/Home'
import Products from './pages/Products'
const App = () => {
  const Layout = () => {
    return (
      <div className='flex'>
        <div>
          <Menu />
        </div>
        <div>
          <Outlet />
        </div>
      </div>
  )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/users",
          element: <Users/>
        },
        {
          path: "/products",
          element: <Products/>
        },
      
      ]
    }
  ])
    
  return (
    <div >
      <RouterProvider router={router} />
    </div>
  )
}

export default App