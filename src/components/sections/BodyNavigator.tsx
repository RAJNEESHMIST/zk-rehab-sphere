import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldAlert, CheckCircle2, Star, Clock, 
  MapPin, Dumbbell, Compass, ChevronRight, Zap
} from 'lucide-react';
import { bodyConditions } from '../../services/seedData';
import { BodyPartCondition } from '../../types';
import { useSiteData } from '../../context/SiteDataContext';
import { useCursor } from '../../context/CursorContext';

// Import high-resolution condition images
import bodyNeckImg from '../../assets/treatments/body_neck.png';
import bodyShoulderImg from '../../assets/treatments/joint_pain_management.png';
import bodyBackImg from '../../assets/treatments/lower_back_pain.png';
import bodyHipImg from '../../assets/treatments/posture_correction.png';
import bodyKneeImg from '../../assets/treatments/post_surgery_rehab.png';
import bodyAnkleImg from '../../assets/treatments/balance_gait.png';
import fallbackImg from '../../assets/physio-treatment.png';

interface BodyNavigatorProps {
  onOpenBooking: (serviceName?: string) => void;
}

const regionVisuals: Record<string, { 
  image: string; 
  timeline: string; 
  explanation: string;
  milestones: { week: string; goal: string }[];
}> = {
  neck: {
    image: bodyNeckImg,
    timeline: '2–4 Weeks (8–10 Sessions)',
    explanation: 'Cervical spondylosis and neck stiffness are treated using gentle joint decompression, myofascial release, and upper trapezius posture realignment.',
    milestones: [
      { week: 'Week 1', goal: 'Relieve pain & release muscle stiffness' },
      { week: 'Week 2', goal: 'Restore range of head rotation' },
      { week: 'Week 3-4', goal: 'Ergonomic training & posture correction' }
    ]
  },
  shoulder: {
    image: bodyShoulderImg,
    timeline: '4–8 Weeks (12–16 Sessions)',
    explanation: 'Adhesive capsulitis (Frozen Shoulder) and rotator cuff tendinitis require progressive joint capsular stretching, passive elevation, and active resistance training.',
    milestones: [
      { week: 'Week 1-2', goal: 'Pain mitigation & passive flex mobilization' },
      { week: 'Week 3-4', goal: 'Active assistive rotation exercises' },
      { week: 'Week 5-8', goal: 'Functional strength load recovery' }
    ]
  },
  back: {
    image: bodyBackImg,
    timeline: '3–6 Weeks (10–14 Sessions)',
    explanation: 'Sciatica and disc herniation (L4-L5) respond rapidly to McKenzie disc extension centralization, core stabilization, and sciatic nerve flossing.',
    milestones: [
      { week: 'Week 1', goal: 'Decompression & pain centralization' },
      { week: 'Week 2-3', goal: 'Lumbar spine stability & core activation' },
      { week: 'Week 4-6', goal: 'Flexibility retention & lift training' }
    ]
  },
  hip: {
    image: 'https://images.unsplash.com/photo-1582719471384-894fca16e374?auto=format&fit=crop&w=1200&q=80',
    timeline: '4–8 Weeks Post-Op',
    explanation: 'Total Hip Replacement (THR) and hip osteoarthritis home rehab focuses on progressive weight-bearing, gait correction, and gluteus medius strengthening.',
    milestones: [
      { week: 'Week 1-2', goal: 'Assisted mobilization & scar management' },
      { week: 'Week 3-4', goal: 'Hip abductor activation & gate stance correction' },
      { week: 'Week 5-8', goal: 'Unassisted balance & stairs climbing' }
    ]
  },
  knee: {
    image: bodyKneeImg,
    timeline: '3–6 Weeks Post-Op',
    explanation: 'Total Knee Replacement (TKR) and ACL ligament tears require early terminal knee extension, quad activation, swelling reduction, and stairs training.',
    milestones: [
      { week: 'Week 1', goal: 'Pain management & 90-degree flexion arc' },
      { week: 'Week 2-3', goal: 'Terminal quad extension & leg raise' },
      { week: 'Week 4-6', goal: 'Progressive load bearing & gait cycle' }
    ]
  },
  ankle: {
    image: 'https://images.unsplash.com/photo-1597764690523-15bea4c581c9?auto=format&fit=crop&w=1200&q=80',
    timeline: '2–4 Weeks (6–8 Sessions)',
    explanation: 'Plantar fasciitis and chronic ankle sprains are managed with proprioception balance training, calf stretching, and arch support guidance.',
    milestones: [
      { week: 'Week 1', goal: 'Joint stability & swelling reduction' },
      { week: 'Week 2', goal: 'Proprioception balance board practice' },
      { week: 'Week 3-4', goal: 'Achilles loading & dynamic mobility' }
    ]
  }
};

export const BodyNavigator: React.FC<BodyNavigatorProps> = ({ onOpenBooking }) => {
  const { experts } = useSiteData();
  const { setCursorMode, setCursorText } = useCursor();
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');
  const [selectedPartKey, setSelectedPartKey] = useState<string>('knee');

  const selectedCondition: BodyPartCondition =
    bodyConditions.find((b) => b.partKey === selectedPartKey) || bodyConditions[0];

  const assignedExperts = experts.filter((e) => selectedCondition.relatedExpertIds.includes(e.id));
  const activeVisual = regionVisuals[selectedPartKey] || regionVisuals['knee'];

  const nodes = [
    { key: 'neck', name: 'Neck / Cervical', view: 'both', top: '18%', left: '50%', labelClass: 'left-11 top-1/2 -translate-y-1/2 translate-z-[45px] hover:translate-z-[55px]' },
    { key: 'shoulder', name: 'Shoulders', view: 'front', top: '24%', left: '32%', labelClass: 'right-11 top-1/2 -translate-y-1/2 translate-z-[45px] hover:translate-z-[55px]' },
    { key: 'back', name: 'Lumbar Back', view: 'back', top: '40%', left: '50%', labelSide: 'right', labelClass: 'left-11 top-1/2 -translate-y-1/2 translate-z-[45px] hover:translate-z-[55px]' },
    { key: 'hip', name: 'Hip & Pelvis', view: 'both', top: '55%', left: '42%', labelClass: 'right-11 top-1/2 -translate-y-1/2 translate-z-[45px] hover:translate-z-[55px]' },
    { key: 'knee', name: 'Knee Joint', view: 'both', top: '75%', left: '44%', labelClass: 'left-11 top-1/2 -translate-y-1/2 translate-z-[45px] hover:translate-z-[55px]' },
    { key: 'ankle', name: 'Ankle & Foot', view: 'front', top: '91%', left: '42%', labelClass: 'right-11 top-1/2 -translate-y-1/2 translate-z-[45px] hover:translate-z-[55px]' },
  ];

  return (
    <section id="navigator" className="py-24 relative z-10 overflow-hidden bg-slate-950">
      
      {/* Background neon ambient */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-cyan-400 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            <Zap size={14} className="text-cyan-400" /> Interactive Joint Assessment
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Anatomical Body <span className="text-gradient">Explorer</span>
          </h2>
          <p className="text-base text-slate-300">
            Select a highlighted joint node on the diagnostic blueprint to view the clinical recovery roadmap, home protocols, and matched specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          
          {/* Left Column: Holographic Blueprint Map */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Front / Back Toggle */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10 mb-8 shadow-xl">
              <button
                onClick={() => setViewAngle('front')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  viewAngle === 'front'
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Anterior (Front)
              </button>
              <button
                onClick={() => setViewAngle('back')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  viewAngle === 'back'
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Posterior (Back)
              </button>
            </div>

            {/* Anatomical Hologram Graphic Box */}
            <div className="relative w-[320px] h-[520px] rounded-[32px] glass-panel border border-cyan-500/30 p-6 flex items-center justify-center shadow-[0_20px_50px_rgba(6,182,212,0.15)] perspective-1000 transform-style-3d">
              {/* Grid scanning background */}
              <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
              
              {/* Anatomical Outline SVG (Rotating in 3D Space) */}
              <motion.div 
                animate={{ rotateY: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
                className="relative w-full h-full flex items-center justify-center opacity-70 select-none transform-style-3d"
              >
                <svg viewBox="0 0 200 400" className="w-full h-full stroke-cyan-500/40 fill-cyan-950/10 stroke-[2.2]">
                  {/* Cyber Hologram Head */}
                  <circle cx="100" cy="55" r="18" className="stroke-[2.5] stroke-cyan-400/45" />
                  {/* Spine line */}
                  <line x1="100" y1="73" x2="100" y2="210" className="stroke-[2.5] stroke-cyan-400/45 stroke-dasharray-[2,2]" />
                  {/* Shoulders bar */}
                  <line x1="64" y1="96" x2="136" y2="96" className="stroke-[3.5] stroke-cyan-400/45" />
                  {/* Pelvis bar */}
                  <path d="M78,210 L122,210 L115,225 L85,225 Z" className="fill-cyan-500/10 stroke-[2.5]" />
                  {/* Torso outline */}
                  <path d="M78,96 L64,120 L72,210 L128,210 L136,120 L122,96 Z" className="fill-none stroke-cyan-500/35" />
                  {/* Left Arm */}
                  <path d="M64,96 L45,150 L38,200" className="fill-none stroke-cyan-500/35 stroke-[4.5]" strokeLinecap="round" />
                  {/* Right Arm */}
                  <path d="M136,96 L155,150 L162,200" className="fill-none stroke-cyan-500/35 stroke-[4.5]" strokeLinecap="round" />
                  {/* Left Leg */}
                  <path d="M85,225 L88,300 L84,370" className="fill-none stroke-cyan-500/35 stroke-[5.5]" strokeLinecap="round" />
                  {/* Right Leg */}
                  <path d="M115,225 L112,300 L116,370" className="fill-none stroke-cyan-500/35 stroke-[5.5]" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* Anatomical Nodes Map */}
              {nodes
                .filter((node) => node.view === 'both' || node.view === viewAngle)
                .map((node) => {
                  const isSelected = selectedPartKey === node.key;

                  return (
                    <button
                      key={node.key}
                      style={{ 
                        top: node.top, 
                        left: node.left,
                        transform: 'translate(-50%, -50%)',
                        transformStyle: 'preserve-3d'
                      }}
                      onClick={() => setSelectedPartKey(node.key)}
                      onMouseEnter={() => {
                        setCursorMode('explore');
                        setCursorText(node.name);
                      }}
                      onMouseLeave={() => {
                        setCursorMode('default');
                        setCursorText('');
                      }}
                      className="absolute group cursor-pointer z-30 transform-style-3d"
                    >
                      <span
                        className={`absolute -inset-3.5 rounded-full transition-all duration-300 ${
                          isSelected
                            ? 'bg-cyan-400/30 animate-ping opacity-100'
                            : 'bg-cyan-500/5 group-hover:bg-cyan-400/10'
                        }`}
                      />
                      <div
                        className={`relative w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500 transform-style-3d ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-400 to-teal-400 border-white text-slate-950 scale-110 shadow-[0_0_20px_#06b6d4] translate-z-[30px]'
                            : 'bg-slate-900/90 border-cyan-400/40 text-cyan-300 group-hover:scale-105 translate-z-[15px]'
                        }`}
                      >
                        {/* Glowing core indicator */}
                        <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-cyan-400 animate-pulse'}`} />
                      </div>
                      
                      {/* Joint Label */}
                      <span
                        className={`absolute whitespace-nowrap text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border transition-all duration-300 transform-style-3d ${node.labelClass} ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 border-white shadow-lg shadow-cyan-500/30 z-40 scale-105'
                            : 'bg-slate-900/95 text-slate-300 border-white/10 opacity-70 group-hover:opacity-100 z-20'
                        }`}
                      >
                        {node.name}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Right Column: High-tech Detail Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCondition.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[32px] glass-panel border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl bg-slate-950/90"
              >
                {/* Header Pane */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">
                      Anatomical Diagnostic Region
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      {selectedCondition.partName}
                    </h3>
                  </div>

                  <button
                    onClick={() => onOpenBooking(`${selectedCondition.partName} Care`)}
                    className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer"
                  >
                    Book Home Consult
                  </button>
                </div>

                {/* Treatment Image & Recovery Timeline progress */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg">
                    <img
                      src={activeVisual.image}
                      alt={selectedCondition.partName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImg;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-slate-950/90 px-2.5 py-1 rounded-md border border-cyan-400/30 backdrop-blur-md">
                      Verified Session
                    </span>
                  </div>

                  <div className="sm:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-wider">
                      <Clock size={14} className="text-teal-400" />
                      <span>Timeline: {activeVisual.timeline}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      {activeVisual.explanation}
                    </p>
                  </div>
                </div>

                {/* Stage Progression Milestones */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Compass size={14} className="text-cyan-400" /> Clinical Progression Timeline
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeVisual.milestones?.map((m, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-black text-[9px] uppercase tracking-wide shrink-0">
                          {m.week}
                        </span>
                        <p className="text-slate-200 font-medium leading-relaxed">{m.goal}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symptoms & Diagnoses */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-rose-400" /> Symptoms & Diagnoses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCondition.commonSymptoms.map((sym, idx) => (
                      <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Exercises */}
                {selectedCondition.exercises && selectedCondition.exercises.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Dumbbell size={14} className="text-cyan-400" /> Recommended Home Exercises
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCondition.exercises.map((ex, idx) => (
                        <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-xs font-bold text-cyan-300">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Specialist */}
                {assignedExperts.length > 0 && (
                  <div className="pt-5 mt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={assignedExperts[0].image} 
                        alt={assignedExperts[0].name} 
                        className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40 shadow-md shrink-0" 
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm font-black text-white">{assignedExperts[0].name}</p>
                          <div className="flex items-center text-amber-400 text-[10px]">
                            <Star size={10} className="fill-amber-400 mr-0.5" />
                            <span>{assignedExperts[0].rating}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-cyan-300 font-semibold">{assignedExperts[0].role} • {assignedExperts[0].qualification}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenBooking(assignedExperts[0].name)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:text-cyan-300 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5 group/btn cursor-pointer"
                    >
                      <span>Book with {assignedExperts[0].name.split(' ')[0]}</span>
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
