/* Product Context */
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { products as initialProducts, categories } from '../data/products';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // featured, price-asc, price-desc, newest
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // featured - keep original order
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  const getProductById = useCallback(
    (id) => products.find((p) => p.id === id),
    [products]
  );

  const getRelatedProducts = useCallback(
    (productId, limit = 4) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return [];
      return products
        .filter((p) => p.id !== productId && p.category === product.category)
        .slice(0, limit);
    },
    [products]
  );

  const openProductModal = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const value = {
    products,
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    selectedProduct,
    openProductModal,
    closeProductModal,
    getProductById,
    getRelatedProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}