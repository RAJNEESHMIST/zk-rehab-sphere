import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Star, Clock, MapPin, Calendar, CheckCircle2, Globe, Mail } from 'lucide-react';
import { Expert } from '../../types';

interface ExpertBioModalProps {
  expert: Expert | null;
  onClose: () => void;
  onOpenBooking: (doctorName?: string) => void;
}

export const ExpertBioModal: React.FC<ExpertBioModalProps> = ({ expert, onClose, onOpenBooking }) => {
  // Lock background body scrolling when modal is active
  useEffect(() => {
    if (expert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expert]);

  if (!expert) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-3xl rounded-3xl glass-panel border border-cyan-500/30 p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all z-20"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Doctor Photo & Quick Details */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-48 h-56 rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl mb-4 bg-slate-900">
                <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-slate-950/90 border border-yellow-400/40 text-yellow-400 font-bold text-xs">
                  <Star size={14} className="fill-yellow-400" />
                  <span>{expert.rating} / 5.0 ({expert.reviewsCount} reviews)</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-white">{expert.name}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">{expert.role}</p>
              <p className="text-xs text-slate-300 mb-4">{expert.qualification}</p>

              {/* Social Links */}
              <div className="flex gap-3 mb-6">
                {expert.socialLinks?.linkedin && (
                  <a href={expert.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-all">
                    <Globe size={16} />
                  </a>
                )}
                {expert.socialLinks?.instagram && (
                  <a href={expert.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-all">
                    <Globe size={16} />
                  </a>
                )}
                {expert.socialLinks?.email && (
                  <a href={`mailto:${expert.socialLinks.email}`} className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-all">
                    <Mail size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Right Biography & Details */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Biography & Philosophy</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{expert.biography}</p>
              </div>

              {/* Specializations */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Clinical Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {expert.specializations.map((spec, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-xs font-semibold text-cyan-300">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {expert.certifications && expert.certifications.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Award size={14} className="text-cyan-400" /> Certifications & Accreditation
                  </h4>
                  <div className="space-y-1.5">
                    {expert.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability & Location */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Schedule</p>
                    <p className="font-semibold text-white">{expert.availability}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Coverage</p>
                    <p className="font-semibold text-white">{expert.location}</p>
                  </div>
                </div>
              </div>

              {/* Booking CTA */}
              <button
                onClick={() => {
                  const name = expert.name;
                  onClose();
                  onOpenBooking(name);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20"
              >
                <Calendar size={18} />
                <span>Book Home Visit with {expert.name}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
