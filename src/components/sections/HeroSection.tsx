import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, ShieldCheck, Sparkles, MapPin, CheckCircle2, PhoneCall } from 'lucide-react';
import { HeroFrame3D } from '../3d/HeroFrame3D';
import { useCursor } from '../../context/CursorContext';
import { useSiteData } from '../../context/SiteDataContext';
import heroBgImg from '../../assets/hero.png';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking }) => {
  const { settings } = useSiteData();
  const { setCursorMode, setCursorText } = useCursor();

  const titles = [
    "Evidence-Based Home Visit Physiotherapy",
    "Specialized Neurological & Stroke Rehab",
    "Post-Surgical Joint & Knee Recovery",
    "Expert Spine & Sciatica Decompression"
  ];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden bg-slate-950">
      
      {/* Cinematic Photography Background with Soft Emerald & Cyan Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroBgImg}
          alt="Home Physiotherapy Session ZK Rehab Sphere"
          className="w-full h-full object-cover object-center scale-105 filter opacity-25 blur-[1px]"
        />
        {/* Soft Emerald Gradient & Deep Dark Vibe */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <Sparkles size={16} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300">
                Chandigarh Tricity Premier Home Visit Platform
              </span>
            </motion.div>

            {/* Headline */}
            <div className="min-h-[130px] sm:min-h-[150px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={titleIndex}
                  initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -25, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]"
                >
                  {titles[titleIndex].split(' ').slice(0, 2).join(' ')}{' '}
                  <span className="text-gradient">
                    {titles[titleIndex].split(' ').slice(2).join(' ')}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Hero Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
            >
              {settings.heroSubtitle ||
                "Helping patients recover safely in the comfort of their homes through personalized rehabilitation across Chandigarh, Mohali, & Kharar."}
            </motion.p>

            {/* Locality Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1"
            >
              {['Chandigarh', 'Mohali (SAS Nagar)', 'Kharar'].map((area) => (
                <div key={area} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200 backdrop-blur-md">
                  <MapPin size={14} className="text-cyan-400" />
                  <span>{area}</span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              {/* Primary CTA */}
              <button
                onClick={onOpenBooking}
                onMouseEnter={() => {
                  setCursorMode('book');
                  setCursorText('Book Visit');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95"
              >
                <Calendar size={18} className="stroke-[2.5]" />
                <span>Book Home Visit</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </button>

              {/* Secondary CTA */}
              <a
                href="https://wa.me/917340820883"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => {
                  setCursorMode('explore');
                  setCursorText('Expert');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-bold text-slate-200 glass-panel border border-white/10 hover:border-cyan-400/40 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <PhoneCall size={18} className="text-cyan-400" />
                <span>Talk to Expert</span>
              </a>
            </motion.div>

            {/* Trust Badges Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 text-left border-t border-white/10"
            >
              {[
                "100% Home Visit Care",
                "Certified Physiotherapists",
                "Hospital-Grade Equipment",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </motion.div>

          </div>

          {/* Right Column: Founder Sajid Khan 3D Interactive Card Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HeroFrame3D />
          </div>

        </div>
      </div>
    </section>
  );
};
