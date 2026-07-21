import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ratingService from '../services/ratingService';
import './RatingModal.css';

const RatingModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape, and stop the page behind the overlay from scrolling.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // A reopened modal should start blank rather than showing the last attempt.
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHover(0);
      setFeedback('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await ratingService.submitRating({
        rating_value: rating,
        feedback: feedback.trim() || null,
      });
      onClose();
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="rating-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="rating-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="rating-modal-title">Rate Your Experience</h2>
        <p>How was your interview/analysis experience?</p>

        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((index) => (
            <button
              type="button"
              key={index}
              className={index <= (hover || rating) ? 'star on' : 'star off'}
              aria-label={`${index} star${index === 1 ? '' : 's'}`}
              aria-pressed={index === rating}
              onClick={() => {
                setRating(index);
                setError('');
              }}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(0)}
            >
              <span className="star-icon">&#9733;</span>
            </button>
          ))}
        </div>

        <textarea
          placeholder="Any additional feedback? (Optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="4"
        />

        {error && <p className="rating-error">{error}</p>}

        <div className="rating-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Skip
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RatingModal;
