import React, { useState, useEffect, useEffectEvent, useRef } from 'react';
import { createPortal } from 'react-dom';
import ratingService from '../services/ratingService';
import './RatingModal.css';

const RatingModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);

  // Close on Escape, and stop the page behind the overlay from scrolling.
  const onCloseEvent = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCloseEvent();
    };
    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Open/close the native <dialog> imperatively so the browser provides
  // focus trapping, Escape dismissal, and the ::backdrop for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
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
      <dialog
        ref={dialogRef}
        className="rating-modal-content"
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

        <label htmlFor="rating-feedback" className="rating-feedback-label">
          Additional feedback (optional)
        </label>
        <textarea
          id="rating-feedback"
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
      </dialog>
    </div>,
    document.body
  );
};

export default RatingModal;
