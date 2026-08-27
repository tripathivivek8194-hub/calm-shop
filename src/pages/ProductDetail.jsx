import { useState, Suspense, lazy, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { getProductBySlug, getInStockProducts, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../contexts/ReviewsContext';
import { ReviewList, ReviewForm, ReviewSummary } from '../components/reviews';
import { useAuth } from '../contexts/AuthContext';
import './ProductDetail.css';

const ProductViewer = lazy(() => import('../components/product/ProductViewer').then(module => ({ default: module.ProductViewer })));

export function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { getReviewStats } = useReviews();
  const product = getProductBySlug(slug);
  const allProducts = getInStockProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const handleReviewSubmitted = useCallback(() => {
    setShowReviewForm(false);
    setActiveTab('reviews');
  }, []);

  if (!product) {
    return (
      <div className="product-detail not-found">
        <div className="container">
          <div className="not-found-content">
            <h1>Product Not Found</h1>
            <p>The product you're looking for doesn't exist or is no longer available.</p>
            <Link to="/shop" className="btn btn-primary">
              <ChevronLeft size={18} aria-hidden="true" />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const reviewStats = getReviewStats(product.id);

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setQuantity(1);
  };

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: `On orders over ${formatPrice(100)}` },
    { icon: Shield, title: 'Secure Checkout', desc: 'Encrypted payments' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  ];

  return (
    <div className="product-detail">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="product-main">
        <div className="container">
          <div className="product-layout">
            <div className="product-gallery">
              <div className="main-viewer">
                <Suspense fallback={<div className="viewer-loading">Loading 3D viewer...</div>}>
                  <ProductViewer
                    geometryType={product.geometryType}
                    color={product.color}
                    secondaryColor={product.secondaryColor}
                    material={product.material}
                    className="product-viewer-canvas"
                  />
                </Suspense>

                <button
                  className="view-fullscreen-btn"
                  onClick={() => setShowViewer(true)}
                  aria-label="View 3D model in fullscreen"
                >
                  <RotateCcw size={18} aria-hidden="true" />
                  <span>View Fullscreen</span>
                </button>
              </div>

              <div className="thumbnails" role="group" aria-label="Product images">
                <button
                  className={`thumbnail ${selectedImage === 0 ? 'active' : ''}`}
                  onClick={() => setSelectedImage(0)}
                  aria-label="Main view"
                  aria-current={selectedImage === 0 ? 'true' : 'false'}
                >
                  <div
                    className="thumb-color"
                    style={{
                      background: `linear-gradient(135deg, ${product.color} 0%, ${product.secondaryColor} 100%)`
                    }}
                  />
                </button>
                <button
                  className={`thumbnail ${selectedImage === 1 ? 'active' : ''}`}
                  onClick={() => setSelectedImage(1)}
                  aria-label="3D view"
                  aria-current={selectedImage === 1 ? 'true' : 'false'}
                >
                  <div className="thumb-icon">◈</div>
                </button>
                <button
                  className={`thumbnail ${selectedImage === 2 ? 'active' : ''}`}
                  onClick={() => setSelectedImage(2)}
                  aria-label="Detail view"
                  aria-current={selectedImage === 2 ? 'true' : 'false'}
                >
                  <div
                    className="thumb-color"
                    style={{ background: product.color }}
                  />
                </button>
              </div>
            </div>

            <div className="product-info-panel">
              <span className="product-category-tag">{product.category}</span>
              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating" aria-label="Rating: 5 out of 5 stars">
                <span className="stars" aria-hidden="true">★★★★★</span>
                <span className="review-count">(24 reviews)</span>
              </div>

              <p className="product-description">{product.description}</p>

              <div className="product-price-block">
                <span className="current-price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              {product.originalPrice && (
                <span className="sale-tag">Save {formatPrice(product.originalPrice - product.price)}</span>
              )}

              <div className="quantity-selector">
                <label htmlFor="quantity" className="quantity-label">Quantity</label>
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    className="qty-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="99"
                    aria-label="Quantity"
                  />
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="btn btn-primary btn-lg btn-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className={`btn btn-secondary btn-lg btn-full wishlist-btn ${inWishlist ? 'active' : ''}`}
                  onClick={() => toggleItem(product)}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={inWishlist}
                >
                  <Heart size={20} aria-hidden="true" style={{ fill: inWishlist ? 'currentColor' : 'none' }} />
                  {inWishlist ? 'Saved' : 'Save for Later'}
                </button>
              </div>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">SKU</span>
                  <span className="meta-value">{product.id}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Dimensions</span>
                  <span className="meta-value">
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Weight</span>
                  <span className="meta-value">{product.weight} kg</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Material</span>
                  <span className="meta-value">{product.material.charAt(0).toUpperCase() + product.material.slice(1)} finish</span>
                </div>
              </div>

              <div className="product-share">
                <span className="share-label">Share:</span>
                <button className="share-btn" aria-label="Share on Twitter">
                  <Share2 size={18} aria-hidden="true" />
                </button>
                <button className="share-btn" aria-label="Share via email">
                  <Heart size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <section className="product-features" aria-labelledby="features-title">
            <h2 id="features-title" className="visually-hidden">Product Features</h2>
            <div className="features-grid">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="feature-card">
                  <div className="feature-icon" aria-hidden="true">
                    <Icon size={24} />
                  </div>
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <ReviewSummary
              productId={product.id}
              showWriteButton
              onWriteClick={() => setShowReviewForm(true)}
            />

          <section className="product-details-tabs" aria-labelledby="details-title">
            <h2 id="details-title" className="visually-hidden">Product Details</h2>
            <div className="tabs">
              <div className="tab-list" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === 'description'}
                  className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'specifications'}
                  className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'care'}
                  className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}
                  onClick={() => setActiveTab('care')}
                >
                  Care Guide
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'reviews'}
                  className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews <span className="tab-review-count">({reviewStats.totalReviews})</span>
                </button>
              </div>

              <div
                role="tabpanel"
                className={`tab-panel ${activeTab === 'description' ? 'active' : ''}`}
                hidden={activeTab !== 'description'}
              >
                <div className="tab-content">
                  <h3>The Story Behind {product.name}</h3>
                  <p>{product.description}</p>
                  <p>
                    Each piece is crafted using precision techniques that honor the mathematical beauty
                    of its form. The {product.material} finish enhances the natural geometry while
                    providing a tactile, calming presence in any environment.
                  </p>
                  <h4>Perfect For</h4>
                  <ul>
                    <li>Meditation spaces and yoga studios</li>
                    <li>Minimalist desk and shelf decor</li>
                    <li>Thoughtful gifts for design lovers</li>
                    <li>Creating focal points in calm interiors</li>
                  </ul>
                </div>
              </div>

              <div
                role="tabpanel"
                className={`tab-panel ${activeTab === 'specifications' ? 'active' : ''}`}
                hidden={activeTab !== 'specifications'}
              >
                <div className="tab-content">
                  <table className="specs-table">
                    <tbody>
                      <tr><th>Geometry Type</th><td>{product.geometryType}</td></tr>
                      <tr><th>Primary Color</th><td>{product.color}</td></tr>
                      <tr><th>Secondary Color</th><td>{product.secondaryColor}</td></tr>
                      <tr><th>Material Finish</th><td>{product.material}</td></tr>
                      <tr><th>Dimensions</th><td>{product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm</td></tr>
                      <tr><th>Weight</th><td>{product.weight} kg</td></tr>
                      <tr><th>Category</th><td>{product.category}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                role="tabpanel"
                className={`tab-panel ${activeTab === 'care' ? 'active' : ''}`}
                hidden={activeTab !== 'care'}
              >
                <div className="tab-content">
                  <h4>Care Instructions</h4>
                  <ul>
                    <li>Dust gently with a soft, dry microfiber cloth</li>
                    <li>Avoid direct sunlight to prevent color fading</li>
                    <li>Keep away from moisture and humidity</li>
                    <li>Handle with clean, dry hands</li>
                    <li>Store in original packaging when not displayed</li>
                  </ul>
                  <p className="care-note">
                    The {product.material} finish is durable but benefits from gentle care.
                    Each piece will develop a unique patina over time, adding to its character.
                  </p>
                </div>
              </div>

              <div
                role="tabpanel"
                className={`tab-panel ${activeTab === 'reviews' ? 'active' : ''}`}
                hidden={activeTab !== 'reviews'}
              >
                <div className="tab-content reviews-tab-content">
                  {showReviewForm ? (
                    <ReviewForm
                      productId={product.id}
                      onClose={() => setShowReviewForm(false)}
                      onSuccess={handleReviewSubmitted}
                    />
                  ) : (
                    <>
                      <ReviewSummary
                        productId={product.id}
                        showWriteButton
                        onWriteClick={() => setShowReviewForm(true)}
                      />
                      <ReviewList productId={product.id} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {relatedProducts.length > 0 && (
            <section className="related-products" aria-labelledby="related-title">
              <h2 id="related-title" className="section-title">You May Also Like</h2>
              <div className="product-grid" role="list">
                {relatedProducts.map((related) => {
                  const inWishlist = isInWishlist(related.id);
                  return (
                    <article key={related.id} className="product-card" role="listitem">
                    <Link to={`/shop/${related.slug}`} className="product-card-link" aria-label={related.name}>
                      <div className="product-image" aria-hidden="true">
                          <div
                            className="product-color-preview"
                            style={{
                              background: `linear-gradient(135deg, ${related.color} 0%, ${related.secondaryColor} 100%)`
                            }}
                          />
                      </div>
                        <div className="product-info">
                          <span className="product-category">{related.category}</span>
                          <h3 className="product-name">{related.name}</h3>
                          <p className="product-price">{formatPrice(related.price)}</p>
                      </div>
                    </Link>
                    <button
                      className={`wishlist-btn-card ${inWishlist ? 'active' : ''}`}
                      onClick={() => toggleItem(related)}
                      aria-label={inWishlist ? `Remove ${related.name} from wishlist` : `Add ${related.name} to wishlist`}
                      aria-pressed={inWishlist}
                    >
                      <Heart size={18} aria-hidden="true" />
                    </button>
                  </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {showViewer && (
        <div className="viewer-modal" role="dialog" aria-modal="true" aria-labelledby="viewer-modal-title">
          <div className="viewer-modal-content">
            <button className="viewer-modal-close" onClick={() => setShowViewer(false)} aria-label="Close 3D viewer">
              <ChevronRight size={24} aria-hidden="true" />
            </button>
            <h2 id="viewer-modal-title" className="visually-hidden">{product.name} - 3D View</h2>
            <Suspense fallback={<div className="viewer-loading">Loading 3D viewer...</div>}>
              <ProductViewer
                geometryType={product.geometryType}
                color={product.color}
                secondaryColor={product.secondaryColor}
                material={product.material}
                className="product-viewer-canvas modal-viewer"
                isModal
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
