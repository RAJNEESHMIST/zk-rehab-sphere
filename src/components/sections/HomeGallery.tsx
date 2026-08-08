import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Maximize2, Sliders } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';
import { useSiteData } from '../../context/SiteDataContext';
import { GalleryItem } from '../../types';

// Import local gallery images
import strokeRehabImg from '../../assets/treatments/stroke_rehab.png';
import parkinsonsTherapyImg from '../../assets/treatments/parkinsons_therapy.png';
import balanceGaitImg from '../../assets/treatments/balance_gait.png';
import postSurgeryRehabImg from '../../assets/treatments/post_surgery_rehab.png';
import sportsInjuryRehabImg from '../../assets/treatments/sports_injury_rehab.png';
import jointPainManagementImg from '../../assets/treatments/joint_pain_management.png';
import lowerBackPainImg from '../../assets/treatments/lower_back_pain.png';
import bodyNeckImg from '../../assets/treatments/body_neck.png';
import postureCorrectionImg from '../../assets/treatments/posture_correction.png';
import electrotherapyImg from '../../assets/treatments/electrotherapy.png';
import shockwaveTherapyImg from '../../assets/treatments/shockwave_therapy.png';
import roboticRehabImg from '../../assets/treatments/robotic_rehab.png';

// Fallback high-quality recovery cards if IndexedDB is still loading/empty
const fallbackGallery: GalleryItem[] = [
  // Neurological Care
  {
    id: 'gal-1',
    title: 'Stroke Rehabilitation Home Session',
    category: 'Neurological Care',
    image: strokeRehabImg,
    beforeImage: strokeRehabImg,
    afterImage: strokeRehabImg,
    caption: 'Patient undergoing upper limb neuro-plasticity & functional movement retraining in Sector 34, Chandigarh.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-2',
    title: "Parkinson's Tremor Management",
    category: 'Neurological Care',
    image: parkinsonsTherapyImg,
    caption: 'Coordination and progressive balance exercise session under therapist supervision.',
    location: 'Mohali'
  },
  {
    id: 'gal-3',
    title: 'Balance & Gait Mobility Training',
    category: 'Neurological Care',
    image: balanceGaitImg,
    caption: 'Preventing fall risks and correcting biomechanical walking patterns for geriatric safety.',
    location: 'Kharar'
  },

  // Orthopedic Rehab
  {
    id: 'gal-4',
    title: 'Post Knee Replacement flexion mobilization',
    category: 'Orthopedic Rehab',
    image: postSurgeryRehabImg,
    beforeImage: postSurgeryRehabImg,
    afterImage: postSurgeryRehabImg,
    caption: 'Progressive unassisted weight-bearing practice 3 weeks post knee replacement surgery.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-5',
    title: 'ACL Ligament Tear Rehabilitation',
    category: 'Orthopedic Rehab',
    image: sportsInjuryRehabImg,
    caption: 'Targeted strengthening of the quadriceps and hamstring muscle group post injury.',
    location: 'Mohali'
  },
  {
    id: 'gal-6',
    title: 'Adhesive Capsulitis (Frozen Shoulder) Therapy',
    category: 'Orthopedic Rehab',
    image: jointPainManagementImg,
    caption: 'Joint mobilization maneuvers and passive stretching routines to restore functional arc.',
    location: 'Kharar'
  },

  // Spine Care
  {
    id: 'gal-7',
    title: 'Lumbar Disc Herniation Decompression',
    category: 'Spine Care',
    image: lowerBackPainImg,
    caption: 'McKenzie mechanical diagnosis spinal retraction and lumbar posture corrections.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-8',
    title: 'Cervical Spondylosis Manual Traction',
    category: 'Spine Care',
    image: bodyNeckImg,
    caption: 'Bedside manual traction to relieve nerve pressure and reduce acute cervical radiation.',
    location: 'Mohali'
  },
  {
    id: 'gal-9',
    title: 'Spinal Alignment & Posture Scan',
    category: 'Spine Care',
    image: postureCorrectionImg,
    caption: 'Assessing muscular balance and spinal curvatures to correct seated ergonomics.',
    location: 'Kharar'
  },

  // Advanced Equipment
  {
    id: 'gal-10',
    title: 'Portable Ultrasound Therapy Session',
    category: 'Advanced Equipment',
    image: electrotherapyImg,
    caption: 'Hospital-grade portable electrotherapy & ultrasound modalities brought directly to the patient’s bedside for targeted pain alleviation.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-11',
    title: 'Dual Channel TENS Muscle Stimulation',
    category: 'Advanced Equipment',
    image: electrotherapyImg,
    caption: 'Targeted nerve stimulation and pain gating therapy for chronic joint arthrosis.',
    location: 'Mohali'
  },
  {
    id: 'gal-12',
    title: 'Bedside Mechanical Spine Decompression',
    category: 'Advanced Equipment',
    image: roboticRehabImg,
    caption: 'Deploying high-traction decompression belts to reduce sciatic radiation.',
    location: 'Kharar'
  }
];

export const HomeGallery: React.FC = () => {
  const { gallery } = useSiteData();
  const { setCursorMode, setCursorText } = useCursor();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<any | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [showAll, setShowAll] = useState(false);

  const categories = ['All', 'Neurological Care', 'Orthopedic Rehab', 'Spine Care', 'Advanced Equipment'];

  // Dynamic image resolver to translate database cached Unsplash URLs to local high-resolution assets
  const getGalleryImage = (imgUrl: string) => {
    if (!imgUrl) return fallbackImg;
    if (imgUrl.includes('photo-1576091160550-2173dba999ef') || imgUrl.includes('photo-1581071805260-15cc9c47d272')) return strokeRehabImg;
    if (imgUrl.includes('photo-1516549655169-df83a0774514')) return parkinsonsTherapyImg;
    if (imgUrl.includes('photo-1544367567-0f2fcb009e0b')) return balanceGaitImg;
    if (imgUrl.includes('photo-1579684389782-64d84b5e901d') || imgUrl.includes('photo-1598256989800-fe5f95da9787')) return postSurgeryRehabImg;
    if (imgUrl.includes('photo-1519826314078-191d81bf10b0')) return sportsInjuryRehabImg;
    if (imgUrl.includes('photo-1518611012118-696072aa579a')) return jointPainManagementImg;
    if (imgUrl.includes('photo-1506126613408-eca07ce68773')) return lowerBackPainImg;
    if (imgUrl.includes('photo-1620188467120-5042ed1eb5da')) return bodyNeckImg;
    if (imgUrl.includes('photo-1584515979956-d9f6e5d09982')) return electrotherapyImg;
    if (imgUrl.includes('photo-1600334089648-b0d9d3028eb2')) return electrotherapyImg;
    if (imgUrl.includes('photo-1629909613654-28e377c37b09')) return roboticRehabImg;
    return imgUrl;
  };

  const fallbackImg = electrotherapyImg;

  // Fallback to local array if database items haven't finished loading/seeding
  const activeGalleryItems = gallery && gallery.length > 0 ? gallery : fallbackGallery;

  const filteredItems = selectedFilter === 'All'
    ? activeGalleryItems
    : activeGalleryItems.filter((item) => item.category === selectedFilter);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6);

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-slate-950/90">
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Professional Care, Real Recovery
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Our Recovery <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Illustrative photo gallery showing manual mobilization, rehabilitation equipment setups, and clinical progression exercises.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
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
            {displayedItems.map((item) => (
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
                    src={getGalleryImage(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  {/* Branding Board Overlay */}
                  <div className="absolute bottom-4 right-4 z-10 px-2 py-0.5 rounded bg-slate-950/80 border-l border-cyan-400 text-[8px] font-black uppercase text-white shadow-md tracking-widest backdrop-blur-md">
                    ZK REHAB SPHERE
                  </div>
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

        {filteredItems.length > 6 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 hover:scale-105 active:scale-95"
            >
              {showAll ? 'Show Less Gallery Cards' : 'Show All Gallery Cards'}
            </button>
          </div>
        )}

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
                        src={getGalleryImage(activeLightboxItem.afterImage)}
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
                          src={getGalleryImage(activeLightboxItem.beforeImage)}
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
                        src={getGalleryImage(activeLightboxItem.image)}
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
