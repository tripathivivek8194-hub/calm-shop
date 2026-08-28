import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingBag, Heart, UserRound, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import './Header.css';

export function Header() {
  const location = useLocation();
  const { itemCount, toggleCart, isOpen: cartOpen } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const stored = localStorage.getItem('darkMode');
    let initial = prefersDark;
    if (stored) {
      try {
        initial = JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse darkMode from localStorage:', e);
      }
    }
    setDarkMode(initial);
    document.documentElement.classList.toggle('dark', initial);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', JSON.stringify(next));
    document.documentElement.classList.toggle('dark', next);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${cartOpen ? 'cart-open' : ''}`} role="banner">
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="Calm Shop Home">
          <span className="logo-mark" aria-hidden="true">✦</span>
          <span className="logo-text">calm<span>shop</span></span>
        </Link>

        <nav id="main-nav" className={`nav ${mobileMenuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <ul className="nav-list">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/wishlist"
            className="icon-btn wishlist-header-btn"
            aria-label={`Wishlist${wishlistItemCount > 0 ? ` with ${wishlistItemCount} items` : ', empty'}`}
          >
            <Heart size={20} aria-hidden="true" />
            {wishlistItemCount > 0 && (
              <span className="wishlist-count" aria-live="polite" aria-atomic="true">
                {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/account" className="account-link" aria-label="Your account">
                <UserRound size={18} aria-hidden="true" />
                <span>{user.name}</span>
              </Link>
              <Link to="/admin" className="account-link admin-link" aria-label="Admin dashboard">
                <span>⚙️</span>
                <span>Admin</span>
              </Link>
              <button className="icon-btn" onClick={logout} aria-label="Log out">
                <LogOut size={20} aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link to="/login" className="account-link" aria-label="Log in or create an account">
              <UserRound size={18} aria-hidden="true" />
              <span>Account</span>
            </Link>
          )}

          <button
            className="icon-btn cart-btn"
            onClick={toggleCart}
            aria-label={`Shopping cart${itemCount > 0 ? ` with ${itemCount} items` : ', empty'}`}
            aria-expanded={cartOpen}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {itemCount > 0 && (
              <span className="cart-count" aria-live="polite" aria-atomic="true">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="main-nav"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
