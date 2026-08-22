import { Link } from 'react-router-dom';
import { Camera, Send, Mail, Truck, Shield, RotateCcw, Heart } from 'lucide-react';
import { formatPrice } from '../../data/products';
import './Footer.css';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Best Sellers', href: '/shop?sort=featured' },
    { label: 'Gift Cards', href: '/gift-cards' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'FAQ', href: '/faq' },
  ],
  company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
};

const features = [
  { icon: Truck, label: 'Free Shipping', desc: `On orders over ${formatPrice(100)}` },
  { icon: Shield, label: 'Secure Checkout', desc: 'Encrypted payments' },
  { icon: RotateCcw, label: 'Easy Returns', desc: '30-day return policy' },
  { icon: Heart, label: 'Made with Care', desc: 'Handcrafted quality' },
];

const socialLinks = [
  { icon: Camera, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Send, href: 'https://x.com', label: 'X' },
  { icon: Mail, href: 'mailto:hello@calmshop.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Calm Shop Home">
              <span className="logo-mark" aria-hidden="true">✦</span>
              <span className="logo-text">calm<span>shop</span></span>
            </Link>
            <p className="footer-tagline">
              Curated geometric forms for calm spaces. Each piece designed to bring
              a moment of tranquility into your daily life.
            </p>
            <div className="footer-social">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="social-link"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer-nav" aria-label="Shop links">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-list">
              {footerLinks.shop.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-nav" aria-label="Support links">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-list">
              {footerLinks.support.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-nav" aria-label="Company links">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-list">
              {footerLinks.company.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-features">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="feature">
              <div className="feature-icon" aria-hidden="true">
                <Icon size={20} />
              </div>
              <div className="feature-text">
                <span className="feature-label">{label}</span>
                <span className="feature-desc">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} calmshop. All rights reserved.
        </p>
        <div className="footer-legal">
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
