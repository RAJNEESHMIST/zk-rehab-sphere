import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, UserCheck, Calendar, ArrowRight, Globe, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { Expert } from '../../types';
import { ExpertBioModal } from '../modals/ExpertBioModal';
import { useCursor } from '../../context/CursorContext';

interface ExpertsSectionProps {
  onOpenBooking: (doctorName?: string) => void;
}

export const ExpertsSection: React.FC<ExpertsSectionProps> = ({ onOpenBooking }) => {
  const { experts } = useSiteData();
  const { setCursorMode, setCursorText } = useCursor();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  return (
    <section id="experts" className="py-24 relative z-10 overflow-hidden bg-slate-950/90">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Certified Clinical Specialists & Leadership
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Meet Our <span className="text-gradient">Physiotherapy Doctors</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Certified neurological, orthopedic, and sports rehabilitation specialists providing ethical, evidence-based home visits across Chandigarh, Mohali, & Kharar.
          </p>
        </div>

        {/* Premium Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {experts.map((doctor) => (
            <motion.div
              key={doctor.id}
              whileHover={{ y: -10, scale: 1.02 }}
              onMouseEnter={() => {
                setCursorMode('view');
                setCursorText('Profile');
              }}
              onMouseLeave={() => {
                setCursorMode('default');
                setCursorText('');
              }}
              onClick={() => setSelectedExpert(doctor)}
              className="rounded-3xl glass-panel border border-cyan-500/20 p-6 flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer group bg-slate-950/80"
            >
              <div>
                {/* Doctor Photo Frame */}
                <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-900">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 py-1 px-3 rounded-full bg-slate-950/85 backdrop-blur-md border border-yellow-400/40 text-yellow-400 font-extrabold text-xs">
                    <Star size={12} className="fill-yellow-400" />
                    <span>{doctor.rating}</span>
                  </div>

                  {/* Experience Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider">
                    <Award size={12} />
                    <span>{doctor.experienceYears}+ Yrs Experience</span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-xs font-bold text-cyan-400 mb-1">{doctor.role}</p>
                <p className="text-xs text-slate-300 font-medium mb-3">{doctor.qualification}</p>

                {/* Spoken Languages & Availability */}
                <div className="space-y-1.5 pt-2 border-t border-white/10 mb-4 text-[11px] text-slate-300 font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Globe size={12} className="text-cyan-400" />
                    <span>English, Hindi, Punjabi</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-teal-300">
                    <Calendar size={12} />
                    <span>{doctor.availability || 'Mon - Sat (Home Visits)'}</span>
                  </div>
                </div>

                {/* Specializations Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {doctor.specializations.slice(0, 3).map((spec, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-200">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedExpert(doctor);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 group-hover:bg-cyan-500 group-hover:text-slate-950 text-xs font-black text-cyan-300 flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>View Full Clinical Bio</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Expert Profile Modal */}
      <ExpertBioModal
        expert={selectedExpert}
        onClose={() => setSelectedExpert(null)}
        onOpenBooking={onOpenBooking}
      />
    </section>
  );
};
