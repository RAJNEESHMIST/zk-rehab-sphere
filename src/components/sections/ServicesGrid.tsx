import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Calendar, Star, Clock, Brain, Dumbbell, ShieldAlert, Award, 
  Sparkles, ShieldCheck, HeartPulse, Accessibility, Compass, Zap, Cpu
} from 'lucide-react';

// Import treatment images
import strokeRehabImg from '../../assets/treatments/stroke_rehab.png';
import parkinsonsTherapyImg from '../../assets/treatments/parkinsons_therapy.png';
import balanceGaitImg from '../../assets/treatments/balance_gait.png';
import postSurgeryRehabImg from '../../assets/treatments/post_surgery_rehab.png';
import sportsInjuryRehabImg from '../../assets/treatments/sports_injury_rehab.png';
import jointPainManagementImg from '../../assets/treatments/joint_pain_management.png';
import cervicalPainTherapyImg from '../../assets/treatments/cervical_pain_therapy.png';
import lowerBackPainImg from '../../assets/treatments/lower_back_pain.png';
import postureCorrectionImg from '../../assets/treatments/posture_correction.png';
import shockwaveTherapyImg from '../../assets/treatments/shockwave_therapy.png';
import electrotherapyImg from '../../assets/treatments/electrotherapy.png';
import roboticRehabImg from '../../assets/treatments/robotic_rehab.png';
import fallbackImg from '../../assets/physio-treatment.png';

interface TreatmentCard {
  id: string;
  title: string;
  category: 'Neurological Care' | 'Orthopedic Rehab' | 'Spine Care' | 'Advanced Equipment';
  description: string;
  duration: string;
  recoveryLevel: number;
  image: string;
  icon: React.ReactNode;
}

interface ServicesGridProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onOpenBooking }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const categories = ['All', 'Neurological Care', 'Orthopedic Rehab', 'Spine Care', 'Advanced Equipment'];

  const treatments: TreatmentCard[] = [
    // Neurological Care
    {
      id: 'neuro-1',
      title: 'Stroke Rehabilitation',
      category: 'Neurological Care',
      description: 'Personalized recovery programs to improve mobility, balance, strength, and independence after stroke.',
      duration: '8–12 Weeks',
      recoveryLevel: 5,
      image: strokeRehabImg,
      icon: <Brain className="text-cyan-400" size={20} />
    },
    {
      id: 'neuro-2',
      title: "Parkinson's Therapy",
      category: 'Neurological Care',
      description: 'Improve gait, coordination, flexibility, and quality of life with evidence-based exercises.',
      duration: '6–10 Weeks',
      recoveryLevel: 4,
      image: parkinsonsTherapyImg,
      icon: <HeartPulse className="text-teal-400" size={20} />
    },
    {
      id: 'neuro-3',
      title: 'Balance & Gait Training',
      category: 'Neurological Care',
      description: 'Advanced therapy focused on improving walking patterns and preventing falls.',
      duration: '4–8 Weeks',
      recoveryLevel: 5,
      image: balanceGaitImg,
      icon: <Accessibility className="text-sky-400" size={20} />
    },

    // Orthopedic Rehab
    {
      id: 'ortho-1',
      title: 'Post Surgery Rehabilitation',
      category: 'Orthopedic Rehab',
      description: 'Accelerated recovery after knee replacement, ACL reconstruction, fractures, and orthopedic surgeries.',
      duration: '6–16 Weeks',
      recoveryLevel: 5,
      image: postSurgeryRehabImg,
      icon: <Dumbbell className="text-cyan-400" size={20} />
    },
    {
      id: 'ortho-2',
      title: 'Sports Injury Rehabilitation',
      category: 'Orthopedic Rehab',
      description: 'Restore performance after ligament injuries, muscle tears, sprains, and overuse injuries.',
      duration: '4–12 Weeks',
      recoveryLevel: 5,
      image: sportsInjuryRehabImg,
      icon: <Activity className="text-teal-400" size={20} />
    },
    {
      id: 'ortho-3',
      title: 'Joint Pain Management',
      category: 'Orthopedic Rehab',
      description: 'Reduce pain and restore movement for shoulder, hip, elbow, and knee disorders.',
      duration: '4–8 Weeks',
      recoveryLevel: 4,
      image: jointPainManagementImg,
      icon: <Compass className="text-sky-400" size={20} />
    },

    // Spine Care
    {
      id: 'spine-1',
      title: 'Cervical Pain Therapy',
      category: 'Spine Care',
      description: 'Effective treatment for neck stiffness, cervical spondylosis, and posture correction.',
      duration: '4–8 Weeks',
      recoveryLevel: 4,
      image: cervicalPainTherapyImg,
      icon: <Award className="text-cyan-400" size={20} />
    },
    {
      id: 'spine-2',
      title: 'Lower Back Pain Therapy',
      category: 'Spine Care',
      description: 'Evidence-based rehabilitation for chronic and acute lower back pain.',
      duration: '6 Weeks',
      recoveryLevel: 5,
      image: lowerBackPainImg,
      icon: <ShieldCheck className="text-teal-400" size={20} />
    },
    {
      id: 'spine-3',
      title: 'Posture Correction Program',
      category: 'Spine Care',
      description: 'Improve spinal alignment, ergonomics, and muscular balance for long-term health.',
      duration: '4 Weeks',
      recoveryLevel: 4,
      image: postureCorrectionImg,
      icon: <Sparkles className="text-sky-400" size={20} />
    },

    // Advanced Equipment
    {
      id: 'equip-1',
      title: 'Shockwave Therapy',
      category: 'Advanced Equipment',
      description: 'Non-invasive treatment for chronic tendon pain and musculoskeletal disorders.',
      duration: '6 Sessions',
      recoveryLevel: 5,
      image: shockwaveTherapyImg,
      icon: <Zap className="text-cyan-400" size={20} />
    },
    {
      id: 'equip-2',
      title: 'Electrotherapy',
      category: 'Advanced Equipment',
      description: 'Pain management and muscle stimulation using advanced electrotherapy devices.',
      duration: '10 Sessions',
      recoveryLevel: 4,
      image: electrotherapyImg,
      icon: <Cpu className="text-teal-400" size={20} />
    },
    {
      id: 'equip-3',
      title: 'Robotic Rehabilitation',
      category: 'Advanced Equipment',
      description: 'Technology-assisted rehabilitation for neurological and orthopedic patients.',
      duration: 'Custom Plan',
      recoveryLevel: 5,
      image: roboticRehabImg,
      icon: <Accessibility className="text-sky-400" size={20} />
    }
  ];

  const filteredTreatments = selectedFilter === 'All'
    ? treatments
    : treatments.filter((t) => t.category === selectedFilter);

  return (
    <section id="services" className="py-24 relative z-10 overflow-hidden bg-slate-950">
      
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Rehabilitation Categories
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Our Specialised <span className="text-gradient">Treatment Modalities</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select a specialized category below to explore clinical-grade protocols conducted directly in your home.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
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

        {/* Dynamic Responsive Treatment Cards Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredTreatments.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredCardId(t.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group relative rounded-[24px] overflow-hidden glass-panel border border-white/10 hover:border-cyan-400/50 shadow-xl flex flex-col justify-between h-[480px] bg-slate-950/80 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)]"
                style={{
                  transform: hoveredCardId === t.id ? 'translateY(-6px)' : 'none'
                }}
              >
                
                {/* Top Image Panel */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={t.image}
                    alt={t.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImg;
                    }}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Neon Soft Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating category badge & medical icon */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-400/30 text-[9px] font-black uppercase text-cyan-300 backdrop-blur-md">
                      {t.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-950/80 border border-white/20 flex items-center justify-center backdrop-blur-md">
                    {t.icon}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium line-clamp-2">
                      {t.description}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-xs border-t border-white/5 pt-3">
                    <span className="flex items-center gap-1.5 text-slate-400 font-bold">
                      <Clock size={13} className="text-cyan-400" />
                      {t.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500 font-bold mr-1">Recovery:</span>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(t.recoveryLevel)].map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400" />
                        ))}
                        {[...Array(5 - t.recoveryLevel)].map((_, i) => (
                          <Star key={i} size={11} className="text-slate-700" />
                        ))}
                      </div>
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => onOpenBooking(t.title)}
                      className="flex-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer"
                    >
                      Book Visit
                    </button>
                    <button
                      onClick={() => onOpenBooking(t.title)}
                      className="flex-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-200 bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:text-white transition-all cursor-pointer"
                    >
                      Learn More
                    </button>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
