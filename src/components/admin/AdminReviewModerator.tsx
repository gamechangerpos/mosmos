import React, { useState, useEffect } from 'react';
import { CustomerReview } from '../../types';
import { ReviewService } from '../../services/reviewService';
import { Star, CheckCircle, XCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

export const AdminReviewModerator: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const loadReviews = async () => {
    setLoading(true);
    const list = await ReviewService.getAllReviewsForAdmin();
    setReviews(list);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    await ReviewService.moderateReview(id, status);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = statusFilter === 'all' 
    ? reviews 
    : reviews.filter(r => r.status === statusFilter);

  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="bg-white border border-[#D9D0C2] rounded-sm p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9D0C2] mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#78634B]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold">
              Community Trust & Governance
            </span>
          </div>
          <h3 className="font-serif text-2xl font-light text-[#20221F]">
            Patron Reviews Moderation Queue
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#20221F] text-white'
                  : 'bg-[#F7F4ED] text-[#20221F]/70 hover:bg-[#D9D0C2]'
              }`}
            >
              {tab} {tab === 'pending' && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
          <button
            onClick={loadReviews}
            className="p-1.5 text-gray-500 hover:text-[#78634B] cursor-pointer"
            title="Refresh reviews"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#78634B]">Loading traveler reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#20221F]/50 italic">
          No reviews found in this moderation state.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 border rounded-sm transition-colors ${
                rev.status === 'pending'
                  ? 'bg-amber-50/40 border-amber-300'
                  : rev.status === 'approved'
                  ? 'bg-emerald-50/20 border-emerald-200'
                  : 'bg-rose-50/20 border-rose-200 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-[#B69A68]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-[#B69A68] text-[#B69A68]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-serif text-base font-medium text-[#20221F]">
                    "{rev.title}"
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded ${
                    rev.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rev.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rev.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#20221F]/80 leading-relaxed font-light mb-3">
                {rev.comment}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-black/5 text-xs text-[#20221F]/60">
                <div>
                  <span className="font-medium text-[#20221F]">{rev.authorName}</span>
                  {rev.authorLocation && ` (${rev.authorLocation})`}
                  <span> · {rev.tripType}</span>
                  {rev.targetTitle && <span className="text-[#78634B]"> · Re: {rev.targetTitle}</span>}
                </div>

                <div className="flex items-center gap-2">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleModerate(rev.id, 'approved')}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] uppercase tracking-wider font-semibold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  )}
                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleModerate(rev.id, 'rejected')}
                      className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white text-[10px] uppercase tracking-wider font-semibold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
