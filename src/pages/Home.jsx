import { Link } from 'react-router-dom';
import { getFeaturedProducts, formatPrice } from '../data/products';
import { ChevronRight, Sparkles, Leaf, Droplets, Gem, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import './Home.css';

export function Home() {
  const { toggleItem, isInWishlist } = useWishlist();
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  const values = [
    { icon: Sparkles, title: 'Mindful Design', desc: 'Each form crafted with intention for calm spaces' },
    { icon: Leaf, title: 'Natural Inspiration', desc: 'Geometry drawn from nature\'s peaceful patterns' },
    { icon: Droplets, title: 'Fluid Harmony', desc: 'Shapes that flow and settle like water' },
    { icon: Gem, title: 'Lasting Quality', desc: 'Timeless pieces made to endure beautifully' },
  ];

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <span className="hero-badge">New Collection — Spring Calm</span>
          <h1 id="hero-title" className="hero-title">
            Geometric Forms for <span className="highlight">Calm Spaces</span>
          </h1>
          <p className="hero-subtitle">
            Discover handcrafted abstract objects that bring tranquility into your daily life.
            Each piece explores the quiet beauty of mathematical harmony.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Explore Collection
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/shop?category=spheres" className="btn btn-secondary btn-lg">
              View Spheres
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-shapes">
            <div className="shape shape-1" style={{ background: 'linear-gradient(135deg, #a8d0e6 0%, #d8c8f0 100%)' }} />
            <div className="shape shape-2" style={{ background: 'linear-gradient(135deg, #f8c8d8 0%, #f8d8c8 100%)' }} />
            <div className="shape shape-3" style={{ background: 'linear-gradient(135deg, #b8e8d0 0%, #a8d0e6 100%)' }} />
            <div className="shape shape-4" style={{ background: 'linear-gradient(135deg, #d8c8f0 0%, #b8e8d0 100%)' }} />
          </div>
        </div>
      </section>

      <section className="featured" aria-labelledby="featured-title">
        <div className="section-header">
          <h2 id="featured-title" className="section-title">Featured Pieces</h2>
          <Link to="/shop" className="section-link">
            View All
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="product-grid" role="list">
          {featuredProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <article key={product.id} className="product-card" role="listitem">
                <Link to={`/shop/${product.slug}`} className="product-card-link" aria-label={product.name}>
                  <div className="product-image" aria-hidden="true">
                    <div
                      className="product-color-preview"
                      style={{
                        background: `linear-gradient(135deg, ${product.color} 0%, ${product.secondaryColor} 100%)`
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                  </div>
                </Link>
                <button
                  className={`wishlist-btn-card ${inWishlist ? 'active' : ''}`}
                  onClick={() => toggleItem(product)}
                  aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                  aria-pressed={inWishlist}
                >
                  <Heart size={18} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="values" aria-labelledby="values-title">
        <h2 id="values-title" className="section-title visually-hidden">Our Values</h2>
        <div className="values-grid">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="value-card">
              <div className="value-icon" aria-hidden="true">
                <Icon size={24} />
              </div>
              <h3 className="value-title">{title}</h3>
              <p className="value-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta" aria-labelledby="cta-title">
        <div className="cta-content">
          <h2 id="cta-title" className="cta-title">Ready to Find Your Calm?</h2>
          <p className="cta-text">
            Browse our full collection of geometric forms and discover the piece that speaks to your space.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Shop Collection
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
