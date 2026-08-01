import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Award, HeartPulse, Sparkles, UserCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';
import { TrustPillar } from '../../types';

// Dynamic Unsplash images used for context-specific display

const trustPillars: TrustPillar[] = [
  {
    id: 'doctor-patient',
    title: 'Certified Doctor Assessment',
    subtitle: 'Direct home consultation by clinical specialists',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
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
                  setCursorText('Explore');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                className={`relative rounded-[32px] overflow-hidden cursor-pointer border transition-all duration-500 group ${
                  isActive
                    ? 'lg:flex-[3.5] flex-1 border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.3)] bg-slate-950/40'
                    : 'lg:flex-[1] flex-none h-24 lg:h-auto border-white/10 opacity-75 hover:opacity-100 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-slate-950/80'
                }`}
              >
                {/* Real Photo Background */}
                <motion.img
                  src={pillar.image}
                  alt={pillar.title}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover transform filter brightness-[0.85] group-hover:brightness-100 transition-all duration-700"
                />

                {/* Dark Gradient Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t ${
                    isActive
                      ? 'from-slate-950 via-slate-950/80 to-transparent'
                      : 'from-slate-950/95 via-slate-950/70 to-slate-950/30'
                  }`}
                />

                {/* Pulsing card glow reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Pillar Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400/40 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-cyan-300">
                    {pillar.badge}
                  </span>
                </div>

                {/* Content Container */}
                <div className="absolute inset-0 p-6 lg:p-8 z-20 flex flex-col justify-end h-full">
                  {/* Collapsed State Title (Rotated Vertical on Desktop for Premium Aesthetic) */}
                  {!isActive && (
                    <div className="flex lg:flex-col items-center justify-between lg:h-3/4 lg:justify-end gap-6 w-full pb-2">
                      <h3 className="text-sm font-black text-slate-300 tracking-widest lg:[writing-mode:vertical-lr] lg:rotate-180 uppercase whitespace-nowrap group-hover:text-cyan-300 transition-colors">
                        {pillar.title}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all shrink-0">
                        <ChevronRight size={16} className="lg:rotate-90" />
                      </div>
                    </div>
                  )}

                  {/* Expanded State Full View */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4 max-w-xl"
                    >
                      <div className="inline-block text-[10px] font-black text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                        {pillar.metrics}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                        {pillar.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                        {pillar.subtitle}
                      </p>

                      <div className="space-y-2 pt-3 border-t border-white/10">
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
