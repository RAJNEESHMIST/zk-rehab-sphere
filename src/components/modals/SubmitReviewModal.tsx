import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, User, Phone, Mail, MapPin, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSiteData } from '../../context/SiteDataContext';

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({ isOpen, onClose }) => {
  const { submitPublicReview, experts } = useSiteData();
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    city: 'Chandigarh',
    treatment: 'Orthopedic',
    condition: '',
    rating: 5,
    message: '',
    doctorName: '',
    patientPhoto: '',
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPublicReview({
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      patientEmail: formData.patientEmail,
      city: formData.city,
      treatment: formData.treatment,
      condition: formData.condition || `${formData.treatment} Patient`,
      rating: formData.rating,
      message: formData.message,
      doctorName: formData.doctorName || 'ZK Medical Specialist',
      patientPhoto: formData.patientPhoto || undefined,
    });
    setIsSubmitted(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-xl rounded-3xl glass-panel border border-cyan-500/30 p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={20} />
          </button>

          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} className="text-cyan-400" />
                  <span>Verified Patient Feedback</span>
                </div>
                <h3 className="text-2xl font-black text-white">Share Your Recovery Experience</h3>
                <p className="text-xs text-slate-300">Your review helps other Tricity families find trusted home visit physiotherapy care.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-300 mb-2">Overall Patient Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-yellow-400 hover:scale-125 transition-transform"
                      >
                        <Star
                          size={28}
                          className={(hoverRating !== null ? star <= hoverRating : star <= formData.rating) ? 'fill-yellow-400' : 'text-slate-600'}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-cyan-300">
                      {formData.rating} out of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Patient Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="e.g. Rajeev Sharma"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Phone Number (For Verification)</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={formData.patientPhone}
                        onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.patientEmail}
                        onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                        placeholder="rajeev@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Tricity Location</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Mohali">Mohali</option>
                      <option value="Kharar">Kharar</option>
                    </select>
                  </div>
                </div>

                {/* Treatment Category & Condition */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Treatment Received</label>
                    <select
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Stroke Rehab">Stroke Rehabilitation</option>
                      <option value="Orthopedic">Orthopedic & TKR Care</option>
                      <option value="Sports Injury">Sports Injury Rehab</option>
                      <option value="Back Pain">Back Pain & Sciatica</option>
                      <option value="Post Surgery">Post-Surgery Mobilization</option>
                      <option value="Hijama">Cupping / Hijama Therapy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Attending Specialist (Optional)</label>
                    <select
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Any ZK Specialist</option>
                      {experts.map((exp) => (
                        <option key={exp.id} value={exp.name}>
                          {exp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specific Condition */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Condition Treated (Optional)</label>
                  <input
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    placeholder="e.g. Post Knee Replacement, L4-L5 Sciatica"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Review Message */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Your Patient Review & Story</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share how ZK Rehab Sphere helped your recovery at home..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20 text-sm tracking-wider uppercase"
                >
                  Submit Patient Review for Verification
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-white">Review Submitted for Verification!</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Thank you <strong className="text-cyan-300">{formData.patientName}</strong>! Your review has been sent to our clinical team. Once verified, it will display publicly on our website with a <strong className="text-emerald-400">✔ Verified Patient</strong> badge.
              </p>
              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors text-xs uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
