import { useState } from 'react';
import { ThumbsUp, Star, UserCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useReviews } from '../../contexts/ReviewsContext';
import { formatRelativeTime } from '../../utils/formatters';
import './ReviewList.css';

export function ReviewList({ productId }) {
  const { getReviewsByProduct, markHelpful } = useReviews();
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState('newest');
  const [expandedReviews, setExpandedReviews] = useState(new Set());

  const reviews = getReviewsByProduct(productId);

  const toggleExpand = (reviewId) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });
  };

  const handleHelpful = (reviewId) => {
    if (!user) return;
    // In real app, track which reviews user has marked helpful
    // For now, just increment
    markHelpful(reviewId);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  if (reviews.length === 0) {
    return (
      <div className="reviews-empty">
        <UserCircle size={48} aria-hidden="true" />
        <h3>No reviews yet</h3>
        <p>Be the first to share your experience with this piece.</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="review-list-header">
        <h3 className="review-list-title">{reviews.length} Review{reviews.length !== 1 ? 's' : ''}</h3>
        <div className="review-sort">
          <label htmlFor="review-sort" className="visually-hidden">Sort reviews by</label>
          <select
            id="review-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <div className="reviews-container" role="list" aria-label="Customer reviews">
        {sortedReviews.map((review) => (
          <article
            key={review.id}
            className="review-card"
            role="listitem"
          >
            <header className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar" aria-hidden="true">
                  {review.userAvatar ? (
                    <img src={review.userAvatar} alt="" />
                  ) : (
                    <UserCircle size={32} />
                  )}
                </div>
                <div className="reviewer-details">
                  <span className="reviewer-name">{review.userName}</span>
                  <time className="review-date" dateTime={review.createdAt}>
                    {formatRelativeTime(review.createdAt)}
                  </time>
                </div>
              </div>
              <div className="review-rating" aria-label={`Rated ${review.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'filled' : ''}
                    aria-hidden="true"
                    fill={i < review.rating ? 'currentColor' : 'none'}
                    stroke={i < review.rating ? 'currentColor' : 'currentColor'}
                  />
                ))}
              </div>
            </header>

            {review.title && <h4 className="review-title">{review.title}</h4>}
            <p className="review-text">{review.text}</p>

            {review.verified && (
              <span className="verified-badge" aria-label="Verified purchase">
                <CheckCircle size={14} aria-hidden="true" />
                Verified Purchase
              </span>
            )}

            <footer className="review-footer">
              <button
                className={`helpful-btn ${expandedReviews.has(review.id) ? 'expanded' : ''}`}
                onClick={() => handleHelpful(review.id)}
                aria-label={`${review.helpful} people found this helpful`}
              >
                <ThumbsUp size={16} aria-hidden="true" />
                <span>{review.helpful}</span>
                <span className="helpful-label">Helpful</span>
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}