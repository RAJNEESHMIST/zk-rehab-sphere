import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, X, Maximize2, Sliders } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';
import { GalleryItem } from '../../types';

import physioTreatment from '../../assets/physio-treatment.png';
import receptionModern from '../../assets/reception-modern.png';
import physioGym from '../../assets/physio-gym.png';
import heroImg from '../../assets/hero.png';
import aboutImg from '../../assets/about.png';
import service1 from '../../assets/service-1.png';
import service3 from '../../assets/service-3.png';
import portableElectrotherapy from '../../assets/portable-electrotherapy.png';

const galleryData: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Stroke Rehabilitation Home Session',
    category: 'Neurological Care',
    image: physioTreatment,
    beforeImage: service1,
    afterImage: physioTreatment,
    caption: 'Patient undergoing upper limb neuro-plasticity & functional movement retraining in Sector 34, Chandigarh.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-2',
    title: 'Total Knee Replacement (TKR) Gait Retraining',
    category: 'Orthopedic Rehab',
    image: receptionModern,
    beforeImage: service3,
    afterImage: receptionModern,
    caption: 'Progressive unassisted weight-bearing practice 3 weeks post knee replacement surgery.',
    location: 'Mohali'
  },
  {
    id: 'gal-3',
    title: 'Portable Electrotherapy & Ultrasound Setup',
    category: 'Advanced Equipment',
    image: portableElectrotherapy,
    caption: 'Hospital-grade portable electrotherapy & ultrasound modalities brought directly to the patient’s bedside for targeted pain alleviation.',
    location: 'Kharar'
  },
  {
    id: 'gal-4',
    title: 'Geriatric Balance & Fall Prevention',
    category: 'Geriatric Rehab',
    image: physioGym,
    beforeImage: heroImg,
    afterImage: physioGym,
    caption: 'Proprioception and posture realignment exercises for elderly patient with Parkinson’s.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-5',
    title: 'Spinal Decompression & Sciatica Manual Therapy',
    category: 'Spine Care',
    image: heroImg,
    caption: 'McKenzie disc centralization and sciatic nerve mobilization for acute L4-L5 herniation.',
    location: 'Mohali'
  },
  {
    id: 'gal-6',
    title: 'Clinical Consultation & Diagnostic Assessment',
    category: 'Diagnostic Evaluation',
    image: aboutImg,
    caption: 'Founder Sajid Khan evaluating spinal mobility arc during initial home consultation.',
    location: 'Kharar'
  }
];

export const HomeGallery: React.FC = () => {
  const { setCursorMode, setCursorText } = useCursor();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const categories = ['All', 'Neurological Care', 'Orthopedic Rehab', 'Spine Care', 'Advanced Equipment'];

  const filteredItems = selectedFilter === 'All'
    ? galleryData
    : galleryData.filter((item) => item.category === selectedFilter);

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-slate-950/90">
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest"
          >
            <ImageIcon size={16} className="text-cyan-400" />
            <span>Authentic Home Treatment Archive</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
          >
            Real Patients, <span className="text-gradient">Real Recovery Sessions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg"
          >
            Browse real photographs from our home visit physiotherapy sessions across Chandigarh, Mohali, and Kharar.
          </motion.p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                selectedFilter === cat
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Image Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveLightboxItem(item)}
                onMouseEnter={() => {
                  setCursorMode('view');
                  setCursorText('Enlarge');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-400/50 shadow-xl cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Subtle Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                </div>

                {/* Corner Badges */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">
                    {item.category}
                  </span>
                  {item.beforeImage && (
                    <span className="px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 backdrop-blur-md text-[10px] font-extrabold text-teal-300 flex items-center gap-1">
                      <Sliders size={12} /> Progress Comparison
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                    <Maximize2 size={14} />
                  </div>
                </div>

                {/* Bottom Content overlay */}
                <div className="p-6 relative z-10 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{item.location} Tricity</span>
                    <span className="text-cyan-400 font-bold">Verified Session</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox / Before-After Comparison Modal */}
        <AnimatePresence>
          {activeLightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl"
              onClick={() => setActiveLightboxItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-cyan-400/40 shadow-2xl overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveLightboxItem(null)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 border border-white/20 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        {activeLightboxItem.category} • {activeLightboxItem.location}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      {activeLightboxItem.title}
                    </h3>
                  </div>

                  {/* Interactive Before/After Slider if available */}
                  {activeLightboxItem.beforeImage && activeLightboxItem.afterImage ? (
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden select-none bg-slate-950">
                      {/* After Image (Full width background) */}
                      <img
                        src={activeLightboxItem.afterImage}
                        alt="After Recovery"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-emerald-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-950">
                        Post-Therapy Outcome
                      </div>

                      {/* Before Image (Clipped overlay) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${sliderPosition}%` }}
                      >
                        <img
                          src={activeLightboxItem.beforeImage}
                          alt="Initial Evaluation"
                          className="w-full h-full object-cover max-w-none"
                          style={{ width: '100%', height: '100%' }}
                        />
                        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white border border-white/20">
                          Initial Baseline
                        </div>
                      </div>

                      {/* Divider Slider Handle */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                      />
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_#06b6d4] z-20 pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg">
                          <Sliders size={18} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Standard Lightbox Image */
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950">
                      <img
                        src={activeLightboxItem.image}
                        alt={activeLightboxItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {activeLightboxItem.caption}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
