import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getInStockProducts, getCategories, formatPrice } from '../data/products';
import { Filter, Search, X, Grid, List, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { toggleItem, isInWishlist } = useWishlist();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'featured';
  const query = searchParams.get('q') || '';

  const allProducts = getInStockProducts();
  const categories = getCategories();

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);

    if (normalizedQuery) {
      result = result.filter((product) => [
        product.name,
        product.category,
        product.description,
        product.shortDescription,
        product.material,
        ...product.tags,
      ].some((value) => value.toLowerCase().includes(normalizedQuery)));
    }

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result = [...result].reverse();
        break;
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [allProducts, category, query, sort]);

  const updateCategory = (newCategory) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    setSearchParams(params);
  };

  const updateSort = (newSort) => {
    const params = new URLSearchParams(searchParams);
    if (newSort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    setSearchParams(params);
  };

  const updateQuery = (newQuery) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery.trim()) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'all' || sort !== 'featured' || Boolean(query);

  return (
    <div className="shop">
      <header className="shop-header">
        <div className="container">
          <h1 className="shop-title">Shop Collection</h1>
          <p className="shop-subtitle">
            Explore our curated geometric forms. Each piece designed to bring calm to your space.
          </p>
        </div>
      </header>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className={`sidebar-panel ${mobileFilterOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h2 className="sidebar-title">Filters</h2>
              {hasActiveFilters && (
                <button className="clear-filters" onClick={clearFilters}>
                  <X size={14} aria-hidden="true" />
                  Clear All
                </button>
              )}
            </div>

            <div className="search-field">
              <label className="filter-label" htmlFor="product-search">Search products</label>
              <div className="search-input-wrap">
                <Search size={18} aria-hidden="true" />
                <input
                  id="product-search"
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder="Search by name, material, or mood"
                />
                {query && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => updateQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <fieldset className="filter-group">
              <legend className="filter-label">Category</legend>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={category === 'all'}
                    onChange={() => updateCategory('all')}
                  />
                  <span className="filter-option-text">
                    All Products <span className="filter-count">({allProducts.length})</span>
                  </span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={category === cat.id}
                      onChange={() => updateCategory(cat.id)}
                    />
                    <span className="filter-option-text">
                      {cat.name} <span className="filter-count">({cat.count})</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="filter-group">
              <legend className="filter-label">Sort By</legend>
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => updateSort(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </fieldset>
          </div>
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <p className="results-count">
              {query ? <>Found <strong>{filteredProducts.length}</strong> result{filteredProducts.length === 1 ? '' : 's'} for “{query}”</> : <>Showing <strong>{filteredProducts.length}</strong> of <strong>{allProducts.length}</strong> products</>}
            </p>
            <div className="toolbar-actions">
              <button
                className="mobile-filter-btn"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                aria-expanded={mobileFilterOpen}
              >
                <Filter size={18} aria-hidden="true" />
                Filters
              </button>
              <div className="view-toggle" role="group" aria-label="View mode">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  aria-label="Grid view"
                >
                  <Grid size={18} aria-hidden="true" />
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  aria-label="List view"
                >
                  <List size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon" aria-hidden="true">🔍</div>
              <h2>No products found</h2>
              <p>Try a different search term or adjust your filters.</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                <X size={16} aria-hidden="true" />
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`product-grid ${viewMode}`} role="list">
              {filteredProducts.map((product) => {
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
                        {product.originalPrice && (
                          <span className="sale-badge">Sale</span>
                        )}
                      </div>
                      <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-pricing">
                          <span className="product-price">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
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
          )}
        </div>
      </div>
    </div>
  );
}
