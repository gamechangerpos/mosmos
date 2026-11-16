import React, { useState } from 'react';
import { X, Star, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { ReviewService } from '../../services/reviewService';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'package' | 'destination' | 'tour' | 'stay' | 'general';
  targetSlug?: string;
  targetTitle?: string;
  onSuccess?: () => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetSlug,
  targetTitle,
  onSuccess
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [tripType, setTripType] = useState('Luxury Wildlife Safari');
  const [travelDate, setTravelDate] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !title.trim() || !comment.trim()) {
      setError('Please fill in your name, review headline, and travel feedback.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await ReviewService.submitReview({
        targetType,
        targetSlug,
        targetTitle,
        rating,
        authorName: authorName.trim(),
        authorLocation: authorLocation.trim() || undefined,
        tripType,
        travelDate: travelDate.trim() || 'Recent Expedition',
        title: title.trim(),
        comment: comment.trim()
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#F7F4ED] text-[#20221F] w-full max-w-xl rounded-lg shadow-2xl overflow-hidden border border-[#D9D0C2]">
        
        {/* Header */}
        <div className="p-6 bg-[#20221F] text-[#F7F4ED] flex items-center justify-between border-b border-[#B69A68]/30">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-1">
              Verified Patron Feedback
            </span>
            <h2 className="font-serif text-2xl font-light text-white">
              Share Your Expedition Journey
            </h2>
            {targetTitle && (
              <p className="text-xs text-[#F7F4ED]/60 mt-0.5 truncate max-w-sm">
                Regarding: {targetTitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F4ED] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#B69A68]/10 text-[#78634B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl text-[#20221F]">
              Review Submitted for Expedition Moderation
            </h3>
            <p className="text-xs text-[#20221F]/70 max-w-md mx-auto leading-relaxed">
              Thank you for sharing your experience. To preserve authentic traveler trust, your review will be verified and published to the safari ledger shortly.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#20221F] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#78634B] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Selector */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1.5">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'text-[#B69A68] fill-[#B69A68]'
                          : 'text-[#D9D0C2]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-[#20221F]/60 ml-2 font-medium">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Pendleton"
                  className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                  Your Origin / City
                </label>
                <input
                  type="text"
                  value={authorLocation}
                  onChange={(e) => setAuthorLocation(e.target.value)}
                  placeholder="e.g. London, UK or Chicago, USA"
                  className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                  Expedition Style
                </label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                >
                  <option value="Luxury Wildlife Safari">Luxury Wildlife Safari</option>
                  <option value="Gorilla & Primate Trekking">Gorilla & Primate Trekking</option>
                  <option value="Great Migration Expedition">Great Migration Expedition</option>
                  <option value="Photographic Safari">Photographic Safari</option>
                  <option value="Family Safari">Family Safari</option>
                  <option value="Romantic / Honeymoon Safari">Romantic / Honeymoon Safari</option>
                  <option value="Beach & Island Retreat">Beach & Island Retreat</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                  Month & Year of Travel
                </label>
                <input
                  type="text"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  placeholder="e.g. September 2025"
                  className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                Headline / Experience Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. An awe-inspiring encounter with the mountain gorillas"
                className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                Detailed Feedback *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your encounters, guide knowledge, lodge accommodations, and memorable moments..."
                className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#D9D0C2]">
              <span className="text-[10px] text-[#20221F]/50 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#78634B]" />
                <span>Reviewed by MOS MOS concierge before publication</span>
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
