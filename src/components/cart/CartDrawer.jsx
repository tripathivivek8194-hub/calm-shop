import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ChevronRight, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/products';
import './CartDrawer.css';

export function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const shipping = subtotal >= 100 ? 0 : 12;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button
            className="cart-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon" aria-hidden="true">🛍️</div>
              <h3>Your cart is empty</h3>
              <p>Add some calm geometric forms to get started</p>
              <Link to="/shop" className="btn btn-primary" onClick={closeCart}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className="cart-items" role="list" aria-label="Cart items">
                {items.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item-image" aria-hidden="true">
                      <div
                        className="item-color-swatch"
                        style={{ backgroundColor: item.color }}
                        aria-label={`${item.name} in ${item.color}`}
                      />
                    </div>
                    <div className="cart-item-details">
                      <Link
                        to={`/shop/${item.slug}`}
                        className="cart-item-name"
                        onClick={closeCart}
                      >
                        {item.name}
                      </Link>
                      <span className="cart-item-price">{formatPrice(item.price)}</span>
                      <div className="cart-item-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="quantity-value" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="shipping-notice">
                    Add {formatPrice(100 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
                <button
                  className="btn btn-secondary btn-full"
                  onClick={() => { closeCart(); navigate('/shop'); }}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}