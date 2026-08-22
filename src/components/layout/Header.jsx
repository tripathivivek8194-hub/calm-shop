import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react';
import './Header.css';

export function Header() {
  const location = useLocation();
  const { itemCount, toggleCart, isOpen: cartOpen } = useCart();
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
    const initial = stored ? JSON.parse(stored) : prefersDark;
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

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
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
