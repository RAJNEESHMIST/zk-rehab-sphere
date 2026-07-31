import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, Users, ShieldCheck, PhoneCall, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';
import { AreaCoverageItem } from '../../types';

import physioTreatment from '../../assets/physio-treatment.png';
import receptionModern from '../../assets/reception-modern.png';
import zkReception from '../../assets/zk-reception.png';
import founderImg from '../../assets/founder.jpeg';

const areaData: AreaCoverageItem[] = [
  {
    id: 'chandigarh',
    name: 'Chandigarh City',
    tagline: 'Sectors 1 to 63 • Industrial Area • Manimajra',
    image: physioTreatment,
    responseHours: 'Within 60 Mins',
    patientCount: 220,
    featuredTherapist: 'Sajid Khan (Lead Specialist)',
    landmarks: ['Sector 17 Plaza', 'PGIMER', 'Panjab University', 'Elante Mall Area', 'Sector 34 & 35'],
    localTestimonial: {
      patient: 'Mrs. Devinder Kaur (Age 64)',
      condition: 'Stroke Recovery & Hemiplegia',
      quote: 'Having Sajid Khan visit our home in Sector 34 saved us daily painful hospital transfers. My walking posture has improved dramatically.'
    }
  },
  {
    id: 'mohali',
    name: 'Mohali (SAS Nagar)',
    tagline: 'Phases 1 to 11 • Aerocity • Sector 70 to 125',
    image: receptionModern,
    responseHours: 'Within 45 Mins',
    patientCount: 185,
    featuredTherapist: 'Dr. Numan Ahmed (Orthopedics)',
    landmarks: ['PCA Stadium', 'Fortis Hospital Zone', 'Industrial Focal Point', 'Aerocity Road', 'Kharar Highway'],
    localTestimonial: {
      patient: 'Col. Rajesh Sharma (Retd.)',
      condition: 'Total Knee Replacement (TKR)',
      quote: 'Prompt visits in Phase 7 Mohali. The post-TKR exercise guidance was exceptional and zero stress.'
    }
  },
  {
    id: 'kharar',
    name: 'Kharar & Landran Zone',
    tagline: 'Kharar City • Sunny Enclave • Landran Highway',
    image: zkReception,
    responseHours: 'Within 45 Mins',
    patientCount: 140,
    featuredTherapist: 'Dr. Mehul Verma (Sports & Spine)',
    landmarks: ['Sunny Enclave', 'CU Highway', 'Gillco Valley', 'Landran Circle', 'Kharar Main Market'],
    localTestimonial: {
      patient: 'Gurpreet Singh',
      condition: 'Sciatica & Disc Decompression',
      quote: 'Exceptional home service in Sunny Enclave. My disc pain ceased within 5 sessions without spinal surgery.'
    }
  }
];

interface AreaCoverageSectionProps {
  onOpenBooking: (area?: string) => void;
}

export const AreaCoverageSection: React.FC<AreaCoverageSectionProps> = ({ onOpenBooking }) => {
  const { setCursorMode, setCursorText } = useCursor();
  const [activeAreaId, setActiveAreaId] = useState<string>(areaData[0].id);

  const activeArea = areaData.find((a) => a.id === activeAreaId) || areaData[0];

  return (
    <section id="areas" className="py-24 relative overflow-hidden bg-slate-950">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest"
          >
            <MapPin size={16} className="text-cyan-400" />
            <span>Tricity Home Service Network</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
          >
            Delivering Care Across <span className="text-gradient">Chandigarh, Mohali & Kharar</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg"
          >
            Select your locality below to view active home visit coverage, landmark dispatch zones, and local therapist availability.
          </motion.p>
        </div>

        {/* Locality Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {areaData.map((area) => {
            const isSelected = activeAreaId === area.id;

            return (
              <button
                key={area.id}
                onClick={() => setActiveAreaId(area.id)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-extrabold transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-105'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-white'
                }`}
              >
                <Navigation size={18} className={isSelected ? 'text-slate-950' : 'text-cyan-400'} />
                <span>{area.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Area Content Display Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeArea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel border border-cyan-500/20 p-6 sm:p-8 lg:p-10 rounded-3xl"
          >
            {/* Left Area Photograph & Map Overlay */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/10 group">
              <img
                src={activeArea.image}
                alt={activeArea.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Response Time Badge */}
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-400/30 text-white flex items-center gap-2">
                <Clock size={16} className="text-cyan-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Dispatch Time</p>
                  <p className="text-xs font-black text-white">{activeArea.responseHours}</p>
                </div>
              </div>

              {/* Patient Count Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{activeArea.name} Patients Treated</p>
                  <p className="text-[11px] text-cyan-300 font-semibold">{activeArea.patientCount}+ Successful Recoveries</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/40 font-bold text-xs">
                  <Users size={18} />
                </div>
              </div>
            </div>

            {/* Right Area Details & Local Review */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Coverage Area Verified
                </div>
                <h3 className="text-3xl font-black text-white">{activeArea.name} Home Visits</h3>
                <p className="text-sm font-semibold text-slate-300 mt-1">{activeArea.tagline}</p>
              </div>

              {/* Landmarks covered */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                  Key Dispatch Landmarks & Sectors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeArea.landmarks.map((lm, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} className="text-teal-400" />
                      <span>{lm}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Local Patient Quote Box */}
              <div className="p-5 rounded-2xl bg-white/5 border border-cyan-400/20 space-y-3">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400" />
                  ))}
                  <span className="text-xs text-slate-300 font-bold ml-2">Local Patient Feedback</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic font-medium leading-relaxed">
                  "{activeArea.localTestimonial.quote}"
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <span className="font-bold text-white">{activeArea.localTestimonial.patient}</span>
                  <span className="text-cyan-400 font-semibold">{activeArea.localTestimonial.condition}</span>
                </div>
              </div>

              {/* Area CTA */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenBooking(activeArea.name)}
                  onMouseEnter={() => {
                    setCursorMode('book');
                    setCursorText('Book Visit');
                  }}
                  onMouseLeave={() => {
                    setCursorMode('default');
                    setCursorText('');
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <MapPin size={16} />
                  <span>Book Home Visit In {activeArea.name}</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="https://wa.me/917340820883"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-slate-200 glass-panel border border-white/10 hover:border-cyan-400/40 hover:text-white"
                >
                  <PhoneCall size={16} className="text-cyan-400" />
                  <span>WhatsApp Specialist</span>
                </a>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
