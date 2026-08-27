import { useState, useCallback } from 'react';
import { Star, Send, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useReviews } from '../../contexts/ReviewsContext';
import './ReviewForm.css';

export function ReviewForm({ productId, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const { addReview, isLoading: submitting } = useReviews();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const canSubmit = rating > 0 && text.trim().length >= 10 && isAuthenticated;
  const textLength = text.trim().length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setError('');
    try {
      await addReview(productId, {
        userId: user.id,
        userName: user.name,
        userAvatar: null,
        rating,
        title: title.trim(),
        text: text.trim(),
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  if (!isAuthenticated) {
    return (
      <div className="review-form review-form--login-prompt">
        <div className="login-prompt">
          <div className="login-prompt-icon" aria-hidden="true">
            <Star size={32} fill="currentColor" />
          </div>
          <h3>Share Your Experience</h3>
          <p>Sign in to write a review and help others discover this piece.</p>
          <div className="login-prompt-actions">
            <button className="btn btn-primary" onClick={() => setShowLoginPrompt(true)}>
              <Send size={18} aria-hidden="true" />
              Sign In to Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <div className="review-form-header">
        <h3>Write a Review</h3>
        <button
          type="button"
          className="review-form-close"
          onClick={onClose}
          aria-label="Close review form"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <fieldset className="form-field rating-field">
        <legend className="field-label">Your Rating <span className="required" aria-hidden="true">*</span></legend>
        <div
          className="star-rating-input"
          role="radiogroup"
          aria-label="Select rating"
          aria-required="true"
          onMouseLeave={handleStarLeave}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value !== 1 ? 's' : ''}`}
              className={`star-btn ${value <= displayRating ? 'filled' : ''} ${value === rating ? 'selected' : ''}`}
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => handleStarHover(value)}
            >
              <Star
                size={28}
                fill={value <= displayRating ? 'currentColor' : 'none'}
                stroke="currentColor"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
        {rating === 0 && <span className="field-hint">Click a star to rate</span>}
      </fieldset>

      <div className="form-field">
        <label htmlFor="review-title" className="field-label">Review Title (Optional)</label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength="100"
          className="field-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="review-text" className="field-label">Your Review <span className="required" aria-hidden="true">*</span></label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts... What do you love about this piece? How does it fit in your space?"
          minLength={10}
          maxLength={2000}
          rows={5}
          className="field-textarea"
          aria-describedby="text-count"
        />
        <div id="text-count" className={`field-counter ${textLength < 10 ? 'warning' : ''}`}>
          {textLength} / 2000 characters <span className="min-chars">(minimum 10)</span>
        </div>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!canSubmit || submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={18} aria-hidden="true" className="spinning" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} aria-hidden="true" />
              Submit Review
            </>
          )}
        </button>
      </div>

      <p className="form-note">
        By submitting, you confirm this is your honest experience. Reviews may be moderated.
      </p>
    </form>
  );
}