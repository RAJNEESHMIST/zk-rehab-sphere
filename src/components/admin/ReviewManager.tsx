import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, XCircle, Trash2, ShieldCheck, Sparkles, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { ReviewItem } from '../../types';

export const ReviewManager: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview, saveReview } = useSiteData();
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filterTab === 'all') return true;
    return r.status === filterTab;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  const handleToggleFeature = async (review: ReviewItem) => {
    await saveReview({
      ...review,
      isFeatured: !review.isFeatured,
    });
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-white">Verified Patient Reviews Moderation</h3>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 text-xs font-black">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Approve, moderate, feature, or remove patient reviews before public display.</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 bg-slate-900/60">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all ${
                filterTab === tab
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Review List Grid */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`p-6 rounded-3xl glass-panel border transition-all ${
                review.status === 'pending'
                  ? 'border-yellow-400/50 bg-yellow-500/5'
                  : review.status === 'approved'
                  ? 'border-cyan-500/30 bg-slate-950/80'
                  : 'border-rose-500/30 opacity-60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Patient Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-base font-extrabold text-white">{review.patientName}</h4>
                    <span className="flex items-center gap-1 text-xs text-cyan-300 font-semibold">
                      <MapPin size={12} /> {review.city}
                    </span>
                    <span className="text-xs text-slate-400">({review.patientPhone})</span>
                    
                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        review.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : review.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                      }`}
                    >
                      {review.status}
                    </span>

                    {review.isFeatured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Rating Stars & Treatment */}
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400 gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-cyan-400">
                      {review.treatment} • {review.condition}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-medium pt-1">
                    "{review.message}"
                  </p>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => updateReviewStatus(review.id, 'approved')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-xs font-extrabold transition-all"
                    >
                      <CheckCircle2 size={16} />
                      <span>Approve</span>
                    </button>
                  )}

                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => updateReviewStatus(review.id, 'rejected')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all"
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleFeature(review)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      review.isFeatured
                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {review.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>

                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                    title="Delete Review"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 space-y-2">
          <ShieldCheck size={40} className="mx-auto text-cyan-500/50" />
          <h4 className="text-base font-bold text-white">No Reviews in "{filterTab}" Tab</h4>
        </div>
      )}
    </div>
  );
};
