import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './contexts/AuthContext'
import { ReviewsProvider } from './contexts/ReviewsContext'
import { OrderProvider } from './context/OrderContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ReviewsProvider>
          <OrderProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </OrderProvider>
        </ReviewsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
