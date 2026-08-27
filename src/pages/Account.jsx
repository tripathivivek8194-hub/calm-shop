import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Package, ShoppingBag, UserRound, LogOut, ChevronRight, Box, Mail, MapPin, Clock, CreditCard, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../data/products';
import './Auth.css';

export function Account() {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();
  const { itemCount: cartCount } = useCart();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="account-page container">
        <div className="auth-panel">
          <div className="auth-mark"><UserRound size={22} aria-hidden="true" /></div>
          <p className="auth-eyebrow">Your calmshop account</p>
          <h1>Please sign in</h1>
          <p className="auth-intro">Sign in to view your account, orders, and saved items.</p>
          <div className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <Link to="/login" className="btn btn-primary btn-lg" style={{ textAlign: 'center' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ textAlign: 'center' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(order => order.email === user.email);

  return (
    <div className="account-page container">
      <header className="account-header">
        <div className="auth-mark"><UserRound size={22} aria-hidden="true" /></div>
        <div>
          <p className="auth-eyebrow">Your calmshop account</p>
          <h1>Hello, {user.name}</h1>
          <p>{user.email}</p>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" />
          Sign Out
        </button>
      </header>

      <nav className="account-tabs" aria-label="Account sections">
        <button
          className={`account-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          aria-selected={activeTab === 'overview'}
        >
          Overview
        </button>
        <button
          className={`account-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          aria-selected={activeTab === 'orders'}
        >
          Orders <span className="tab-count">({userOrders.length})</span>
        </button>
        <button
          className={`account-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
          aria-selected={activeTab === 'saved'}
        >
          Saved Items <span className="tab-count">({wishlistCount})</span>
        </button>
      </nav>

      {activeTab === 'overview' && (
        <section className="account-grid" aria-label="Account shortcuts">
          <Link to="/wishlist" className="account-card">
            <Heart aria-hidden="true" />
            <strong>Wishlist</strong>
            <span>{wishlistCount} saved item{wishlistCount === 1 ? '' : 's'}</span>
          </Link>
          <Link to="/cart" className="account-card">
            <ShoppingBag aria-hidden="true" />
            <strong>Cart</strong>
            <span>{cartCount} item{cartCount === 1 ? '' : 's'} ready</span>
          </Link>
          <Link to="/shop" className="account-card">
            <Package aria-hidden="true" />
            <strong>Explore collection</strong>
            <span>Find a new favorite</span>
          </Link>
          {userOrders.length > 0 && (
            <Link to="/account?tab=orders" className="account-card">
              <Box aria-hidden="true" />
              <strong>Recent Orders</strong>
              <span>{userOrders.length} order{userOrders.length === 1 ? '' : 's'} total</span>
            </Link>
          )}
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="orders-section" aria-labelledby="orders-heading">
          <h2 id="orders-heading" className="section-heading">Your Orders</h2>
          {userOrders.length === 0 ? (
            <div className="empty-state">
              <Box size={48} aria-hidden="true" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              <h3>No orders yet</h3>
              <p>Your order history will appear here.</p>
              <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {userOrders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-meta">
                      <div className="order-id">
                        <strong>Order #{order.id}</strong>
                        <span className="order-date">
                          <Clock size={14} aria-hidden="true" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge status-${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="order-total">
                      {formatPrice(order.total)}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-preview" aria-hidden="true">
                          <div
                            className="item-color-dot"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="order-item more-items">
                        +{order.items.length - 3} more item{order.items.length - 3 === 1 ? '' : 's'}
                      </div>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    <div className="order-details">
                      <div className="detail-row">
                        <Mail size={16} aria-hidden="true" />
                        <span>{order.email}</span>
                      </div>
                      <div className="detail-row">
                        <MapPin size={16} aria-hidden="true" />
                        <span>
                          {order.address}, {order.city}, {order.state} - {order.zipCode}
                        </span>
                      </div>
                      <div className="detail-row">
                        <CreditCard size={16} aria-hidden="true" />
                        <span>
                          {order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                           order.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
                        </span>
                      </div>
                    </div>
                    <div className="order-actions">
                      <button className="btn btn-secondary btn-sm">
                        <RotateCcw size={16} aria-hidden="true" />
                        Reorder
                      </button>
                      <Link to={`/shop/${order.items[0]?.slug}`} className="btn btn-primary btn-sm">
                        View Product
                        <ChevronRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'saved' && (
        <section className="saved-section" aria-labelledby="saved-heading">
          <h2 id="saved-heading" className="section-heading">Saved Items</h2>
          <p className="saved-intro">
            {wishlistCount === 0
              ? 'Your wishlist is empty. Start exploring and save your favorites!'
              : `You have ${wishlistCount} item${wishlistCount === 1 ? '' : 's'} saved for later.`}
          </p>
          <Link to="/wishlist" className="btn btn-primary">
            <Heart size={18} aria-hidden="true" />
            View Wishlist
          </Link>
        </section>
      )}
    </div>
  );
}