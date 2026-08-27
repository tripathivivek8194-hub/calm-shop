/* Reviews Context */
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ReviewsContext = createContext(null);

// Mock initial reviews data
const initialReviews = [
  {
    id: 'rev-1',
    productId: 'sphere-cluster-1',
    userId: 'user-1',
    userName: 'Sarah M.',
    userAvatar: null,
    rating: 5,
    title: 'Absolutely stunning piece',
    text: 'The way it catches light throughout the day brings such calm energy to my workspace. Worth every penny.',
    verified: true,
    helpful: 12,
    createdAt: '2024-12-15T10:30:00Z',
  },
  {
    id: 'rev-2',
    productId: 'sphere-cluster-1',
    userId: 'user-2',
    userName: 'James K.',
    userAvatar: null,
    rating: 5,
    title: 'Mesmerizing geometry',
    text: "I find myself just watching it rotate slowly. It's become a daily meditation anchor for me.",
    verified: true,
    helpful: 8,
    createdAt: '2024-11-28T14:15:00Z',
  },
  {
    id: 'rev-3',
    productId: 'sphere-cluster-1',
    userId: 'user-3',
    userName: 'Elena R.',
    userAvatar: null,
    rating: 4,
    title: 'Beautiful craftsmanship',
    text: 'Beautiful craftsmanship and the color is exactly as shown. Packaging was also lovely - felt like opening a gift.',
    verified: true,
    helpful: 5,
    createdAt: '2024-10-12T09:45:00Z',
  },
  {
    id: 'rev-4',
    productId: 'torus-knot-1',
    userId: 'user-4',
    userName: 'Michael T.',
    userAvatar: null,
    rating: 5,
    title: 'Perfect for meditation space',
    text: 'The infinite flow of this piece is exactly what I needed for my meditation corner. The matte finish feels premium.',
    verified: true,
    helpful: 15,
    createdAt: '2024-12-03T16:20:00Z',
  },
  {
    id: 'rev-5',
    productId: 'icosahedron-1',
    userId: 'user-5',
    userName: 'Priya S.',
    userAvatar: null,
    rating: 5,
    title: 'Sacred geometry at its finest',
    text: 'The icosahedron represents water and flow. Having this in my yoga studio has genuinely elevated the energy of the space.',
    verified: true,
    helpful: 9,
    createdAt: '2024-11-20T11:00:00Z',
  },
  {
    id: 'rev-6',
    productId: 'blob-1',
    userId: 'user-6',
    userName: 'David L.',
    userAvatar: null,
    rating: 4,
    title: 'Unique organic form',
    text: 'The metaball shape is so satisfying to look at. It changes character depending on the viewing angle. Fast shipping too.',
    verified: true,
    helpful: 6,
    createdAt: '2024-11-05T13:30:00Z',
  },
  {
    id: 'rev-7',
    productId: 'dodecahedron-1',
    userId: 'user-7',
    userName: 'Aisha K.',
    userAvatar: null,
    rating: 5,
    title: 'Cosmic beauty',
    text: 'The twelve pentagonal faces create such beautiful light patterns. The lavender tone is calming without being dull.',
    verified: true,
    helpful: 11,
    createdAt: '2024-10-28T10:15:00Z',
  },
  {
    id: 'rev-8',
    productId: 'geode-1',
    userId: 'user-8',
    userName: 'Robert M.',
    userAvatar: null,
    rating: 5,
    title: 'Like a miniature landscape',
    text: 'Each facet catches light differently. I spend way too long just turning it in my hands. Incredible detail for the price.',
    verified: true,
    helpful: 14,
    createdAt: '2024-12-10T15:45:00Z',
  },
];

export function ReviewsProvider({ children }) {
  const [savedReviews, setSavedReviews] = useLocalStorage('calm-shop-reviews', initialReviews);
  const [reviews, setReviews] = useState(savedReviews);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    setSavedReviews(reviews);
  }, [reviews, setSavedReviews]);

  const getReviewsByProduct = useCallback((productId) => {
    return reviews.filter((r) => r.productId === productId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reviews]);

  const getReviewStats = useCallback((productId) => {
    const productReviews = getReviewsByProduct(productId);
    if (productReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Number((sum / productReviews.length).toFixed(1));

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return { averageRating, totalReviews: productReviews.length, distribution };
  }, [getReviewsByProduct]);

  const addReview = useCallback(async (productId, reviewData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newReview = {
      id: 'rev-' + Date.now(),
      productId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      userAvatar: reviewData.userAvatar || null,
      rating: reviewData.rating,
      title: reviewData.title,
      text: reviewData.text,
      verified: true,
      helpful: 0,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setIsLoading(false);
    return { success: true, review: newReview };
  }, []);

  const markHelpful = useCallback((reviewId) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
  }, []);

  const value = useMemo(
    () => ({
      reviews,
      isLoading,
      getReviewsByProduct,
      getReviewStats,
      addReview,
      markHelpful,
    }),
    [reviews, isLoading, getReviewsByProduct, getReviewStats, addReview, markHelpful]
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}