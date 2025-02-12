import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import AppLayout from './components/app-layout/AppLayout'
import { RouterProvider } from 'react-router'
import WishList from './pages/Wishlist'
import ProductDetails from './pages/ProductDetails'
import AddProducts from './pages/AddProducts'
import Cart from './pages/Cart'
import ProductListing from './pages/ProductListing'
import Checkout from './pages/Checkout'
import { ThemeProvider } from "@/components/theme-provider"
import ProtectedRoute from './components/ProtectedRoute'
import Onboarding from './pages/Onboarding'
import Categories from './pages/Categories'
import SubCategories from './pages/SubCategories'
import MyOrders from './pages/MyOrders'
import MyProducts from './pages/MyProducts'


function App() {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/onboarding',
          element:  <ProtectedRoute component={ <Onboarding />}/>,
        },
        {
          path: '/:category',
          element:  <ProtectedRoute component={ <Categories />}/>,
        },
        {
          path: '/:category/:subcategory',
          element: <ProtectedRoute component={ <SubCategories />}/>,
        },
        {
          path: '/shop',
          element:<ProtectedRoute component={ <ProductListing />}/>,
        },
        {
          path: '/wishlist',
          element: <ProtectedRoute component={ <WishList />}/>,
        },
        {
          path: '/my-products',
          element: <ProtectedRoute component={ <MyProducts />}/>,
        },
        {
          path: '/shop/:id',
          element: <ProtectedRoute component={ <ProductDetails />}/>,
        },
        {
          path: '/add-product',
          element: <ProtectedRoute component={  <AddProducts />}/>,
        },
        {
          path: '/cart',
          element: <ProtectedRoute component={ <Cart />}/>,
        },
        {
          path: '/checkout',
          element: <ProtectedRoute component={ <Checkout />}/>,
        },
        {
          path: '/my-orders',
          element: <ProtectedRoute component={ <MyOrders />}/>,
        },
      ]
    }
  ])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />

      </ThemeProvider>
    </>
  )
}

export default App
