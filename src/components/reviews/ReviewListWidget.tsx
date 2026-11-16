import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MessageSquarePlus, User } from 'lucide-react';
import { CustomerReview } from '../../types';
import { ReviewService } from '../../services/reviewService';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';

interface ReviewListWidgetProps {
  targetType?: 'package' | 'destination' | 'tour' | 'stay' | 'general';
  targetSlug?: string;
  targetTitle?: string;
}

export const ReviewListWidget: React.FC<ReviewListWidgetProps> = ({
  targetType = 'general',
  targetSlug,
  targetTitle
}) => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    const data = await ReviewService.getApprovedReviews(targetType, targetSlug);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, [targetType, targetSlug]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="bg-white border border-[#D9D0C2] p-6 sm:p-10 my-10 shadow-sm rounded-sm">
      {/* Top Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#D9D0C2]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-1">
            Traveler Testimonials & Field Reports
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F]">
            Authentic Safari Experiences
          </h3>
          <p className="text-xs text-[#20221F]/60 mt-1">
            Independently verified perspectives from patrons who traversed these routes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-4xl font-light text-[#20221F]">
              {averageRating}
            </span>
            <div>
              <div className="flex items-center gap-1 text-[#B69A68]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#B69A68] text-[#B69A68]" />
                ))}
              </div>
              <span className="text-[10px] text-[#20221F]/60 uppercase tracking-wider block mt-0.5">
                {reviews.length} Verified {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#B69A68]" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="pt-8">
        {loading ? (
          <div className="py-8 text-center text-xs text-[#78634B]">Loading verified traveler reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#20221F]/60 italic">
            Be the first traveler to review this expedition experience.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-[#F7F4ED]/60 border border-[#D9D0C2] p-5 sm:p-6 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'text-[#B69A68] fill-[#B69A68]'
                              : 'text-[#D9D0C2]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#20221F]/50 font-medium">
                      {rev.travelDate}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-semibold text-[#20221F] mb-2">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-[#20221F]/80 leading-relaxed font-light mb-4">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D9D0C2]/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#20221F] text-[#B69A68] flex items-center justify-center font-serif text-[10px]">
                      {rev.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-[#20221F] block leading-tight">
                        {rev.authorName}
                      </span>
                      {rev.authorLocation && (
                        <span className="text-[10px] text-[#20221F]/50 block">
                          {rev.authorLocation}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-white border border-[#D9D0C2] text-[9px] uppercase tracking-wider text-[#78634B] rounded">
                    {rev.tripType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetType={targetType}
        targetSlug={targetSlug}
        targetTitle={targetTitle}
        onSuccess={loadReviews}
      />
    </div>
  );
};
