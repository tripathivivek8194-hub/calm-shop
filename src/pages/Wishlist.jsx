import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import './Wishlist.css';

export function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem(product, 1);
    removeItem(product.id);
  };

  const handleMoveAllToCart = () => {
    items.forEach(product => addItem(product, 1));
    clearWishlist();
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <header className="wishlist-header">
          <h1 className="wishlist-title">My Wishlist</h1>
          <p className="wishlist-subtitle">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </header>

        {items.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-icon" aria-hidden="true">
              <Heart size={48} />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love and find them here anytime.</p>
            <Link to="/shop" className="btn btn-primary">
              <ShoppingBag size={18} aria-hidden="true" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-actions">
              <button
                className="btn btn-secondary"
                onClick={handleMoveAllToCart}
                disabled={items.length === 0}
              >
                <ShoppingBag size={18} aria-hidden="true" />
                Move All to Cart
              </button>
              <button
                className="btn btn-ghost"
                onClick={clearWishlist}
                disabled={items.length === 0}
              >
                <Trash2 size={18} aria-hidden="true" />
                Clear Wishlist
              </button>
            </div>

            <div className="wishlist-grid" role="list">
              {items.map((product) => (
                <article key={product.id} className="wishlist-item" role="listitem">
                  <div className="wishlist-item-image" aria-hidden="true">
                    <div
                      className="item-color-preview"
                      style={{
                        background: `linear-gradient(135deg, ${product.color} 0%, ${product.secondaryColor} 100%)`
                      }}
                    />
                  </div>
                  <div className="wishlist-item-details">
                    <Link to={`/shop/${product.slug}`} className="wishlist-item-name">
                      {product.name}
                    </Link>
                    <div className="wishlist-item-meta">
                      <span className="wishlist-item-category">{product.category}</span>
                      <span className="wishlist-item-price">{formatPrice(product.price)}</span>
                    </div>
                    <div className="wishlist-item-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag size={16} aria-hidden="true" />
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-ghost btn-sm wishlist-remove"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
