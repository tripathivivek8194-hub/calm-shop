import assert from 'node:assert/strict';
import test from 'node:test';

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    _reset: () => { store = {}; },
  };
})();

global.localStorage = mockLocalStorage;

const initialReviews = [
  {
    id: 'rev-1',
    productId: 'sphere-cluster-1',
    userId: 'user-1',
    userName: 'Sarah M.',
    userAvatar: null,
    rating: 5,
    title: 'Absolutely stunning piece',
    text: 'The way it catches light throughout the day brings such calm energy to my workspace.',
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
    text: "I find myself just watching it rotate slowly.",
    verified: true,
    helpful: 8,
    createdAt: '2024-11-28T14:15:00Z',
  },
  {
    id: 'rev-3',
    productId: 'torus-knot-1',
    userId: 'user-3',
    userName: 'Elena R.',
    userAvatar: null,
    rating: 4,
    title: 'Beautiful craftsmanship',
    text: 'Beautiful craftsmanship and the color is exactly as shown.',
    verified: true,
    helpful: 5,
    createdAt: '2024-10-12T09:45:00Z',
  },
];

test('ReviewsContext - getReviewsByProduct filters by productId', () => {
  const reviews = [...initialReviews];

  const getReviewsByProduct = (productId) => {
    return reviews.filter((r) => r.productId === productId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const sphereReviews = getReviewsByProduct('sphere-cluster-1');
  const torusReviews = getReviewsByProduct('torus-knot-1');
  const emptyReviews = getReviewsByProduct('non-existent');

  assert.equal(sphereReviews.length, 2);
  assert.equal(sphereReviews[0].id, 'rev-1'); // Most recent first
  assert.equal(sphereReviews[1].id, 'rev-2');

  assert.equal(torusReviews.length, 1);
  assert.equal(torusReviews[0].id, 'rev-3');

  assert.equal(emptyReviews.length, 0);
});

test('ReviewsContext - getReviewStats calculates average rating', () => {
  const reviews = [...initialReviews];

  const getReviewsByProduct = (productId) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const getReviewStats = (productId) => {
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
  };

  const sphereStats = getReviewStats('sphere-cluster-1');
  const torusStats = getReviewStats('torus-knot-1');
  const emptyStats = getReviewStats('non-existent');

  // Sphere has two 5-star reviews
  assert.equal(sphereStats.averageRating, 5.0);
  assert.equal(sphereStats.totalReviews, 2);
  assert.equal(sphereStats.distribution[5], 2);

  // Torus has one 4-star review
  assert.equal(torusStats.averageRating, 4.0);
  assert.equal(torusStats.totalReviews, 1);
  assert.equal(torusStats.distribution[4], 1);

  // Empty returns zeros
  assert.equal(emptyStats.averageRating, 0);
  assert.equal(emptyStats.totalReviews, 0);
});

test('ReviewsContext - addReview creates new review', async () => {
  let reviews = [...initialReviews];

  const addReview = async (productId, reviewData) => {
    await new Promise((resolve) => setTimeout(resolve, 10));

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

    reviews = [newReview, ...reviews];
    return { success: true, review: newReview };
  };

  const result = await addReview('sphere-cluster-1', {
    userId: 'user-new',
    userName: 'New User',
    rating: 4,
    title: 'Great product',
    text: 'Really enjoyed it.',
  });

  assert.equal(result.success, true);
  assert.equal(result.review.productId, 'sphere-cluster-1');
  assert.equal(result.review.rating, 4);
  assert.equal(result.review.helpful, 0);
  assert.ok(result.review.id.startsWith('rev-'));
});

test('ReviewsContext - markHelpful increments helpful count', () => {
  let reviews = [...initialReviews];

  const markHelpful = (reviewId) => {
    reviews = reviews.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  };

  const reviewBefore = reviews.find(r => r.id === 'rev-1');
  assert.equal(reviewBefore.helpful, 12);

  markHelpful('rev-1');

  const reviewAfter = reviews.find(r => r.id === 'rev-1');
  assert.equal(reviewAfter.helpful, 13);

  // Other reviews unchanged
  const reviewOther = reviews.find(r => r.id === 'rev-2');
  assert.equal(reviewOther.helpful, 8);
});