import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Layout } from './components/layout/Layout'
import { Seo } from './components/Seo'
import { PageLoader } from './components/PageLoader'

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })))
const Shop = lazy(() => import('./pages/Shop').then((module) => ({ default: module.Shop })))
const ProductDetail = lazy(() => import('./pages/ProductDetail').then((module) => ({ default: module.ProductDetail })))
const Cart = lazy(() => import('./pages/Cart').then((module) => ({ default: module.Cart })))
const Checkout = lazy(() => import('./pages/Checkout').then((module) => ({ default: module.Checkout })))
const Wishlist = lazy(() => import('./pages/Wishlist').then((module) => ({ default: module.Wishlist })))
const InfoPage = lazy(() => import('./pages/InfoPage').then((module) => ({ default: module.InfoPage })))
const Auth = lazy(() => import('./pages/Auth').then((module) => ({ default: module.Auth })))
const Account = lazy(() => import('./pages/Account').then((module) => ({ default: module.Account })))

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />
}

function App() {
  return (
    <>
      <Seo />
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/:page" element={<InfoPage />} />
        <Route path="*" element={<InfoPage />} />
      </Route>
    </Routes>
    </Suspense>
    </>
  )
}

export default App
