import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Award, HeartPulse, Sparkles, UserCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';
import { TrustPillar } from '../../types';

import physioTreatment from '../../assets/physio-treatment.png';
import receptionModern from '../../assets/reception-modern.png';
import aboutImg from '../../assets/about.png';
import physioGym from '../../assets/physio-gym.png';
import zkReception from '../../assets/zk-reception.png';

const trustPillars: TrustPillar[] = [
  {
    id: 'doctor-patient',
    title: 'Certified Doctor Assessment',
    subtitle: 'Direct home consultation by clinical specialists',
    image: physioTreatment,
    badge: '100% Verified Care',
    metrics: '8+ Years Expertise',
    details: [
      'Comprehensive neurological & orthopedic examination',
      'Individualized baseline motion & strength diagnostic',
      'Transparent treatment goal roadmap with family consultation'
    ]
  },
  {
    id: 'home-treatment',
    title: 'Sanitized Home Therapy',
    subtitle: 'Hospital-grade care in your living room comfort',
    image: receptionModern,
    badge: 'Hygiene Assured',
    metrics: '500+ Active Patients',
    details: [
      'Portable high-frequency ultrasound & TENS electrotherapy',
      'Strict hygiene, sterile equipment & protective protocol',
      'Zero commute strain for pain or mobility restricted patients'
    ]
  },
  {
    id: 'evidence-care',
    title: 'Evidence-Based Protocols',
    subtitle: 'Scientifically validated physical rehabilitation',
    image: aboutImg,
    badge: 'Clinical Excellence',
    metrics: '98.4% Success Rate',
    details: [
      'Bobath & PNF techniques for stroke & neuro rehabilitation',
      'McKenzie mechanical spine decompression protocols',
      'Continuous daily progress tracking & clinical adjustments'
    ]
  },
  {
    id: 'exercise-guidance',
    title: 'Supervised Functional Rehab',
    subtitle: 'Hands-on correction & posture retraining',
    image: physioGym,
    badge: 'Active Recovery',
    metrics: '1-on-1 Dedicated',
    details: [
      'Step-by-step gait modification & unassisted walking practice',
      'Targeted muscle strengthening & joint stabilization',
      'Customized home exercise handbook for daily practice'
    ]
  },
  {
    id: 'ethical-practice',
    title: 'Ethical & Compassionate Care',
    subtitle: 'Patient dignity and family peace of mind',
    image: zkReception,
    badge: 'Trusted In Tricity',
    metrics: 'Chandigarh • Mohali • Kharar',
    details: [
      'Transparent session pricing with zero hidden charges',
      'Punctual physical therapist visits matching your preferred schedule',
      'Direct WhatsApp access to your attending physical therapist'
    ]
  }
];

export const TrustSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(trustPillars[0].id);
  const { setCursorMode, setCursorText } = useCursor();

  return (
    <section id="trust" className="py-20 lg:py-28 relative overflow-hidden bg-slate-950/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest"
          >
            <ShieldCheck size={16} className="text-cyan-400" />
            <span>Why Chandigarh Tricity Trusts Us</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
          >
            Real Professional Care In <span className="text-gradient">Your Own Home</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed"
          >
            We prioritize authentic photography over generic illustrations. Explore our core clinical pillars and authentic home therapy environment below.
          </motion.p>
        </div>

        {/* Interactive Expandable Horizontal Photo Gallery */}
        <div className="flex flex-col lg:flex-row gap-4 h-[650px] lg:h-[520px] w-full">
          {trustPillars.map((pillar) => {
            const isActive = activeId === pillar.id;

            return (
              <motion.div
                key={pillar.id}
                layout
                onClick={() => setActiveId(pillar.id)}
                onMouseEnter={() => {
                  setCursorMode('explore');
                  setCursorText('View Details');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer border transition-all duration-500 ${
                  isActive
                    ? 'lg:flex-[3] flex-1 border-cyan-400/50 shadow-[0_20px_50px_rgba(6,182,212,0.25)]'
                    : 'lg:flex-[1] flex-none h-24 lg:h-auto border-white/10 opacity-70 hover:opacity-100 hover:border-cyan-400/30'
                }`}
              >
                {/* Real Photo Background */}
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                />

                {/* Dark Gradient Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t ${
                    isActive
                      ? 'from-slate-950 via-slate-950/75 to-slate-950/30'
                      : 'from-slate-950/90 via-slate-950/60 to-slate-950/40'
                  }`}
                />

                {/* Pillar Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                    {pillar.badge}
                  </span>
                </div>

                {/* Content Container */}
                <div className="absolute inset-0 p-6 lg:p-8 z-20 flex flex-col justify-end">
                  {/* Collapsed State Title */}
                  {!isActive && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white tracking-wide truncate">
                        {pillar.title}
                      </h3>
                      <ChevronRight size={20} className="text-cyan-400 shrink-0" />
                    </div>
                  )}

                  {/* Expanded State Full View */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 max-w-xl"
                    >
                      <div className="inline-block text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                        {pillar.metrics}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        {pillar.title}
                      </h3>

                      <p className="text-sm text-slate-300 font-medium">
                        {pillar.subtitle}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-white/10">
                        {pillar.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                            <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
