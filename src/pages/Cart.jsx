import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ChevronRight, Heart, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import './Cart.css';

export function Cart() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal >= 100 ? 0 : 12;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <header className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon" aria-hidden="true">🛍️</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any calm geometric forms yet.</p>
            <Link to="/shop" className="btn btn-primary" onClick={handleContinueShopping}>
              <Heart size={18} aria-hidden="true" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-layout">
              <div className="cart-items-section">
                <ul className="cart-items-list" role="list" aria-label="Cart items">
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
                        >
                          {item.name}
                        </Link>
                        <div className="cart-item-meta">
                          <span className="cart-item-category">{item.category}</span>
                          <span className="cart-item-price">{formatPrice(item.price)} each</span>
                        </div>
                        <div className="cart-item-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} aria-hidden="true" />
                          </button>
                          <input
                            type="number"
                            className="quantity-input"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max="99"
                            aria-label={`${item.name} quantity`}
                          />
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Plus size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-total">
                        <span className="item-line-total">{formatPrice(item.price * item.quantity)}</span>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {items.length > 1 && (
                  <button
                    className="clear-cart-btn"
                    onClick={clearCart}
                    type="button"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              <aside className="cart-summary-section">
                <div className="cart-summary">
                  <h2 className="summary-title">Order Summary</h2>

                  <div className="summary-lines">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    {shipping > 0 && (
                      <div className="shipping-progress">
                        <div className="shipping-bar">
                          <div
                            className="shipping-fill"
                            style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="shipping-text">
                          Add {formatPrice(100 - subtotal)} more for free shipping
                        </p>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <ul className="summary-features">
                    <li>
                      <Truck size={18} aria-hidden="true" />
                      <span>Free shipping over {formatPrice(100)}</span>
                    </li>
                    <li>
                      <Heart size={18} aria-hidden="true" />
                      <span>30-day easy returns</span>
                    </li>
                    <li>
                      <ChevronRight size={18} aria-hidden="true" />
                      <span>Secure checkout</span>
                    </li>
                  </ul>

                  <button
                    className="btn btn-primary btn-full btn-lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>

                  <button
                    className="btn btn-secondary btn-full"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </button>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
