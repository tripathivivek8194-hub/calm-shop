import { Star } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewsContext';
import './ReviewSummary.css';

export function ReviewSummary({ productId, showWriteButton = false, onWriteClick }) {
  const { getReviewStats } = useReviews();
  const stats = getReviewStats(productId);

  const { averageRating, totalReviews, distribution } = stats;

  const getPercentage = (rating) => {
    if (totalReviews === 0) return 0;
    return Math.round((distribution[rating] / totalReviews) * 100);
  };

  if (totalReviews === 0) {
    return (
      <div className="review-summary review-summary--empty">
        <div className="empty-rating">
          <Star size={48} fill="currentColor" aria-hidden="true" />
        </div>
        <p className="empty-text">No reviews yet</p>
        {showWriteButton && onWriteClick && (
          <button className="btn btn-primary" onClick={onWriteClick}>
            Be the first to review
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="review-summary">
      <div className="summary-main">
        <div className="overall-score">
          <span className="rating-number">{averageRating.toFixed(1)}</span>
          <div className="rating-stars" aria-label={`${averageRating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.round(averageRating) ? 'filled' : ''}
                fill={i < Math.round(averageRating) ? 'currentColor' : 'none'}
                stroke="currentColor"
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="review-count-text">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="rating-bars" role="img" aria-label="Rating distribution">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="rating-bar-row">
              <span className="bar-label">{rating} star{rating !== 1 ? 's' : ''}</span>
              <div className="bar-track" role="progressbar" aria-valuenow={getPercentage(rating)} aria-valuemin={0} aria-valuemax={100} aria-label={`${rating} star${rating !== 1 ? 's' : ''}: ${getPercentage(rating)}%`}>
                <div
                  className="bar-fill"
                  style={{ width: `${getPercentage(rating)}%` }}
                />
              </div>
              <span className="bar-count">{getPercentage(rating)}%</span>
            </div>
          ))}
        </div>
      </div>

      {showWriteButton && onWriteClick && (
        <button className="btn btn-secondary write-review-btn" onClick={onWriteClick}>
          <Star size={18} fill="currentColor" aria-hidden="true" />
          Write a Review
        </button>
      )}
    </div>
  );
}