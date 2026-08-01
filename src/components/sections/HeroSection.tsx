import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, ShieldCheck, Sparkles, MapPin, CheckCircle2, PhoneCall, Star, Clock, Home, Award } from 'lucide-react';
import { HeroFrame3D } from '../3d/HeroFrame3D';
import { useCursor } from '../../context/CursorContext';
import { useSiteData } from '../../context/SiteDataContext';

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
    }, 4500);
    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden bg-slate-950">
      
      {/* Background Video (Physiotherapy Loop - Therapist, Patient, Exercise, Equipment) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter opacity-25 brightness-[0.4] blur-[0.5px]"
          poster="/src/assets/hero.png"
        >
          <source 
            src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c025f73d7885d511319b4d74f9cf1243&profile_id=139&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
        </video>
        {/* Soft Emerald/Cyan Gradients for Premium Apple-Level Glass Vibe */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Live Availability Status Widget (Priority 4) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex flex-wrap items-center gap-3 px-4 py-2 mb-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-lg"
        >
          <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Today's Availability
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-xs font-extrabold text-white">
            Next Slot: <span className="text-cyan-400">11:30 AM</span>
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-xs font-medium text-slate-300">
            Same Day Visit Available
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* World-class Credentials Badge Row (Priority 1) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5"
            >
              {/* Stars badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-400/30 text-xs font-bold text-slate-200">
                <div className="flex text-amber-400">
                  <Star size={13} className="fill-amber-400" />
                  <Star size={13} className="fill-amber-400" />
                  <Star size={13} className="fill-amber-400" />
                  <Star size={13} className="fill-amber-400" />
                  <Star size={13} className="fill-amber-400" />
                </div>
                <span>4.9 Google Rating</span>
              </div>

              {/* Certified badge */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-400/30 text-xs font-bold text-slate-200">
                <span className="text-cyan-400">👨‍⚕️</span>
                <span>Certified Physiotherapists</span>
              </div>

              {/* Home visits count */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-400/30 text-xs font-bold text-slate-200">
                <span className="text-emerald-400">🏠</span>
                <span>500+ Home Visits</span>
              </div>

              {/* Tricity area */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-400/30 text-xs font-bold text-slate-200">
                <span className="text-indigo-400">📍</span>
                <span>Chandigarh • Mohali • Kharar</span>
              </div>

              {/* 60m response */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/30 text-xs font-extrabold text-red-300">
                <span className="animate-pulse">⚡</span>
                <span>Within 60 Minutes Response</span>
              </div>
            </motion.div>

            {/* BIG Headline */}
            <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={titleIndex}
                  initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -25, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]"
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

            {/* Action Buttons (Three CTAs - Priority 1) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              {/* CTA 1: Book Home Visit */}
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
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Calendar size={18} className="stroke-[2.5]" />
                <span>Book Home Visit</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </button>

              {/* CTA 2: Call Now */}
              <a
                href={`tel:${settings.phone || '+917340820883'}`}
                onMouseEnter={() => {
                  setCursorMode('explore');
                  setCursorText('Call Now');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-black text-white bg-slate-900/95 border border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                <PhoneCall size={18} className="text-cyan-400 stroke-[2.5]" />
                <span>Call Now</span>
              </a>

              {/* CTA 3: WhatsApp */}
              <a
                href={`https://wa.me/${(settings.whatsapp || '917340820883').replace(/[^0-9]/g, '')}?text=Hello%20ZK%20Rehab%20Sphere!%20I%20would%20like%20to%20book%20a%20Home%20Visit%20Physiotherapy%20session.`}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => {
                  setCursorMode('explore');
                  setCursorText('WhatsApp');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-black text-white bg-slate-900/95 border border-emerald-500/30 hover:border-emerald-400 hover:text-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                <svg className="w-5 h-5 fill-emerald-400" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </a>
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
