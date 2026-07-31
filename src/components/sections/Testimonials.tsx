import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, MapPin, Play, Clock, X, CheckCircle2, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';
import { useSiteData } from '../../context/SiteDataContext';

export const Testimonials: React.FC = () => {
  const { reviews } = useSiteData();
  const { setCursorMode, setCursorText } = useCursor();
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const approvedReviews = reviews.filter((r) => r.status === 'approved').slice(0, 3);

  return (
    <section id="testimonials" className="py-24 relative z-10 overflow-hidden bg-slate-950/80">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-extrabold uppercase tracking-widest"
          >
            <ShieldCheck size={16} className="text-cyan-400" />
            <span>✔ Verified Patient Recovery Reviews</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
          >
            Real Patient Recoveries Across <span className="text-gradient">Tricity</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg"
          >
            Read authentic reviews from real patients and families in Chandigarh, Mohali, and Kharar who completed home visit physiotherapy.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {approvedReviews.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8, scale: 1.02 }}
              onMouseEnter={() => {
                setCursorMode('read');
                setCursorText('Story');
              }}
              onMouseLeave={() => {
                setCursorMode('default');
                setCursorText('');
              }}
              className="rounded-3xl glass-panel border border-cyan-500/20 p-7 flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(6,182,212,0.25)] transition-all group relative overflow-hidden bg-slate-950/80"
            >
              <div className="space-y-4">
                
                {/* Patient Photo Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.patientPhoto ? (
                      <img
                        src={item.patientPhoto}
                        alt={item.patientName}
                        className="w-12 h-12 rounded-2xl object-cover border border-cyan-400/30 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold text-base">
                        {item.patientName[0]}
                      </div>
                    )}

                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                        {item.patientName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-0.5">
                        <MapPin size={12} className="text-cyan-400" />
                        <span>{item.city}</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Verified
                  </span>
                </div>

                {/* Rating & Condition Tags */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex text-yellow-400 gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400" />
                    ))}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                    {item.treatment}
                  </span>
                </div>

                {/* Patient Quote */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-medium pt-1 line-clamp-4">
                  "{item.message}"
                </p>

              </div>

              {/* Card Footer: Doctor Name */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Attending Specialist</span>
                  <span className="text-xs font-extrabold text-white">{item.doctorName || 'Sajid Khan'}</span>
                </div>

                <span className="text-[10px] text-cyan-400 font-bold">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

            </motion.div>
          ))}
        </div>

        {/* View All Reviews CTA */}
        <div className="mt-16 text-center">
          <a
            href="#reviews"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#reviews';
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] text-sm tracking-wider uppercase"
          >
            <ShieldCheck size={18} />
            <span>Read All Verified Patient Reviews (4.9⭐ Rating)</span>
            <ArrowRight size={18} />
          </a>
        </div>

      </div>
    </section>
  );
};
