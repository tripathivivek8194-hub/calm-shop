import { Star } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewsContext';
import './RatingDisplay.css';

export function RatingDisplay({
  productId,
  size = 'md',
  showCount = true,
  showStars = true,
  interactive = false,
  onClick,
  value,
  maxStars = 5,
}) {
  const { getReviewStats } = useReviews();
  const stats = productId ? getReviewStats(productId) : null;
  const rating = value ?? stats?.averageRating ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;

  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  const sizeClasses = {
    sm: 'rating-sm',
    md: 'rating-md',
    lg: 'rating-lg',
  };

  const starSizes = { sm: 14, md: 18, lg: 24 };

  const starSize = starSizes[size];

  return (
    <div
      className={`rating-display ${sizeClasses[size]} ${interactive ? 'interactive' : ''}`}
      role="img"
      aria-label={`${rating.toFixed(1)} out of ${maxStars} stars${showCount ? `, ${totalReviews} reviews` : ''}`}
      onClick={onClick}
    >
      {showStars && (
        <div className="rating-stars" aria-hidden="true">
          {stars.map((star) => (
            <Star
              key={star}
              size={starSize}
              className={star <= Math.round(rating) ? 'filled' : star - 0.5 <= rating ? 'half' : ''}
              fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
              stroke="currentColor"
            />
          ))}
        </div>
      )}

      {!showStars && (
        <span className="rating-value" aria-hidden="true">
          {rating.toFixed(1)}
        </span>
      )}

      {showCount && totalReviews > 0 && (
        <span className="rating-count">
          ({totalReviews})
        </span>
      )}

      {showCount && totalReviews === 0 && (
        <span className="rating-count no-reviews">
          (No reviews)
        </span>
      )}
    </div>
  );
}