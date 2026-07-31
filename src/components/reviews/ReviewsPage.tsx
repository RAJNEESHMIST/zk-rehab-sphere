import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Search, Filter, MessageSquarePlus, Award, User, MapPin, CheckCircle2, Clock, ThumbsUp, Activity } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { ReviewItem } from '../../types';

interface ReviewsPageProps {
  onOpenSubmitReview: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onOpenSubmitReview }) => {
  const { reviews } = useSiteData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [selectedTreatment, setSelectedTreatment] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest'>('newest');

  // Filter approved reviews
  const approvedReviews = useMemo(() => {
    return reviews.filter((r) => r.status === 'approved');
  }, [reviews]);

  // Treatments list
  const treatments = ['All', 'Stroke Rehab', 'Orthopedic', 'Sports Injury', 'Back Pain', 'Post Surgery', 'Hijama'];
  const cities = ['All', 'Chandigarh', 'Mohali', 'Kharar'];

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    let result = approvedReviews.filter((r) => {
      const matchesSearch =
        r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.condition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = selectedRating === 'All' || r.rating === parseInt(selectedRating);
      const matchesTreatment = selectedTreatment === 'All' || r.treatment.toLowerCase().includes(selectedTreatment.toLowerCase());
      const matchesCity = selectedCity === 'All' || r.city === selectedCity;

      return matchesSearch && matchesRating && matchesTreatment && matchesCity;
    });

    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOption === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [approvedReviews, searchQuery, selectedRating, selectedTreatment, selectedCity, sortOption]);

  // Rating Distribution Counts
  const rating5Count = approvedReviews.filter((r) => r.rating === 5).length;
  const rating4Count = approvedReviews.filter((r) => r.rating === 4).length;
  const rating3Count = approvedReviews.filter((r) => r.rating === 3).length;
  const totalCount = approvedReviews.length || 1;

  return (
    <div className="pt-28 pb-24 relative min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-widest"
          >
            <ShieldCheck size={16} className="text-cyan-400" />
            <span>100% Verified Home Visit Patient Reviews</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Trusted Patient Stories Across <span className="text-gradient">Tricity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Authentic, unedited feedback from real patients and families in Chandigarh, Mohali, and Kharar who experienced complete home rehabilitation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <button
              onClick={onOpenSubmitReview}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:scale-105 transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] text-sm tracking-wider uppercase"
            >
              <MessageSquarePlus size={18} />
              <span>Submit Your Patient Review</span>
            </button>
          </motion.div>
        </div>

        {/* Animated Statistics & Counters Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl glass-panel border border-cyan-500/30 text-center space-y-2"
          >
            <div className="flex justify-center text-yellow-400 gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-yellow-400" />
              ))}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">4.9 / 5.0</div>
            <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Overall Rating</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl glass-panel border border-cyan-500/30 text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-1 font-bold">
              <ThumbsUp size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">500+</div>
            <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Happy Patients</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl glass-panel border border-cyan-500/30 text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-1 font-bold">
              <Award size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">98%</div>
            <p className="text-xs font-bold text-teal-300 uppercase tracking-wider">Recommendation Rate</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl glass-panel border border-cyan-500/30 text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-1 font-bold">
              <Activity size={20} />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">1000+</div>
            <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">Home Visits Done</p>
          </motion.div>
        </div>

        {/* Rating Breakdown & Filter Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
          
          {/* Rating Breakdown Bar */}
          <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Rating Breakdown</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-slate-300">5 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(rating5Count / totalCount) * 100}%` }} />
                </div>
                <span className="w-8 font-bold text-cyan-300 text-right">{rating5Count}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-slate-300">4 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-yellow-400/80 rounded-full" style={{ width: `${(rating4Count / totalCount) * 100}%` }} />
                </div>
                <span className="w-8 font-bold text-cyan-300 text-right">{rating4Count}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-slate-300">3 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-yellow-400/60 rounded-full" style={{ width: `${(rating3Count / totalCount) * 100}%` }} />
                </div>
                <span className="w-8 font-bold text-cyan-300 text-right">{rating3Count}</span>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient reviews by name, stroke, knee, back pain..."
                className="w-full bg-slate-900/90 border border-cyan-500/30 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-lg"
              />
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Treatment Filter */}
                <select
                  value={selectedTreatment}
                  onChange={(e) => setSelectedTreatment(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-extrabold text-cyan-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="All">All Treatments</option>
                  {treatments.filter((t) => t !== 'All').map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                {/* City Filter */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-extrabold text-cyan-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="All">All Tricity Cities</option>
                  {cities.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Rating Filter */}
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-extrabold text-cyan-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="All">All Star Ratings</option>
                  <option value="5">5 Star Reviews</option>
                  <option value="4">4 Star Reviews</option>
                  <option value="3">3 Star Reviews</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-extrabold text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Reviews Cards Grid */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group rounded-3xl glass-panel border border-cyan-500/20 p-7 flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(6,182,212,0.25)] transition-all relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Patient Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {review.patientPhoto ? (
                        <img
                          src={review.patientPhoto}
                          alt={review.patientName}
                          className="w-12 h-12 rounded-2xl object-cover border border-cyan-400/30"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold text-base">
                          {review.patientName[0]}
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                          {review.patientName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                          <MapPin size={12} className="text-cyan-400" />
                          <span>{review.city} Tricity</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                      <CheckCircle2 size={12} className="text-emerald-400" /> Verified
                    </span>
                  </div>

                  {/* Rating & Treatment */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex text-yellow-400 gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400" />
                      ))}
                    </div>

                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider">
                      {review.treatment}
                    </span>
                  </div>

                  {/* Condition Tag */}
                  <p className="text-xs font-bold text-cyan-200">
                    Condition: {review.condition}
                  </p>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-medium pt-1">
                    "{review.message}"
                  </p>
                </div>

                {/* Footer Attending Doctor & Date */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-300">
                    Dr: {review.doctorName || 'Sajid Khan'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 space-y-4">
            <ShieldCheck size={48} className="mx-auto text-cyan-500/50" />
            <h3 className="text-xl font-bold text-white">No Reviews Match Your Criteria</h3>
            <p className="text-sm">Try clearing filters or submit the first review for this condition!</p>
          </div>
        )}

      </div>
    </div>
  );
};
