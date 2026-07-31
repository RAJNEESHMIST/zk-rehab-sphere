import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2, UserCheck, ArrowRight, Sparkles, Clock, Calendar } from 'lucide-react';
import { bodyConditions } from '../../services/seedData';
import { BodyPartCondition } from '../../types';
import { useSiteData } from '../../context/SiteDataContext';
import { useCursor } from '../../context/CursorContext';

import physioTreatment from '../../assets/physio-treatment.png';
import receptionModern from '../../assets/reception-modern.png';
import zkReception from '../../assets/zk-reception.png';
import physioGym from '../../assets/physio-gym.png';
import service1 from '../../assets/service-1.png';
import service3 from '../../assets/service-3.png';

interface BodyNavigatorProps {
  onOpenBooking: (serviceName?: string) => void;
}

const regionVisuals: Record<string, { image: string; timeline: string; explanation: string }> = {
  neck: {
    image: service1,
    timeline: '2 - 4 Weeks (8-10 Sessions)',
    explanation: 'Cervical spondylosis and neck stiffness are treated using gentle joint decompression, myofascial release, and upper trapezius posture realignment.'
  },
  shoulder: {
    image: receptionModern,
    timeline: '4 - 8 Weeks (12-16 Sessions)',
    explanation: 'Adhesive capsulitis (Frozen Shoulder) and rotator cuff tendinitis require progressive joint capsular stretching, passive elevation, and active resistance training.'
  },
  back: {
    image: physioTreatment,
    timeline: '3 - 6 Weeks (10-14 Sessions)',
    explanation: 'Sciatica and disc herniation (L4-L5) respond rapidly to McKenzie disc extension centralization, core stabilization, and sciatic nerve flossing.'
  },
  hip: {
    image: zkReception,
    timeline: '4 - 8 Weeks Post-Op',
    explanation: 'Total Hip Replacement (THR) and hip osteoarthritis home rehab focuses on progressive weight-bearing, gait correction, and gluteus medius strengthening.'
  },
  knee: {
    image: physioGym,
    timeline: '3 - 6 Weeks Post-Op',
    explanation: 'Total Knee Replacement (TKR) and ACL ligament tears require early terminal knee extension, quad activation, swelling reduction, and stairs training.'
  },
  ankle: {
    image: service3,
    timeline: '2 - 4 Weeks (6-8 Sessions)',
    explanation: 'Plantar fasciitis and chronic ankle sprains are managed with proprioception balance training, calf stretching, and arch support guidance.'
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
    { key: 'neck', name: 'Neck / Cervical', view: 'both', top: '16%', left: '50%' },
    { key: 'shoulder', name: 'Shoulders', view: 'front', top: '24%', left: '32%' },
    { key: 'back', name: 'Lumbar Spine & Back', view: 'back', top: '38%', left: '50%' },
    { key: 'hip', name: 'Hip & Pelvis', view: 'both', top: '50%', left: '42%' },
    { key: 'knee', name: 'Knee Joint', view: 'both', top: '70%', left: '44%' },
    { key: 'ankle', name: 'Ankle & Foot', view: 'front', top: '88%', left: '42%' },
  ];

  return (
    <section id="navigator" className="py-24 relative z-10 overflow-hidden bg-slate-950/80">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-cyan-300 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            <Sparkles size={14} /> Interactive Diagnostic Map
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Body Condition <span className="text-gradient">Explorer</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Select an anatomical region to view real treatment photos, clinical recovery timelines, and matched specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Interactive Body Map */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* View Switcher */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10 mb-6">
              <button
                onClick={() => setViewAngle('front')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  viewAngle === 'front'
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Anterior (Front)
              </button>
              <button
                onClick={() => setViewAngle('back')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  viewAngle === 'back'
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Posterior (Back)
              </button>
            </div>

            {/* Anatomical Body Graphic Box */}
            <div className="relative w-[280px] h-[460px] rounded-3xl glass-panel border border-cyan-500/30 p-4 flex items-center justify-center shadow-2xl">
              <div className="relative w-full h-full flex items-center justify-center opacity-80 select-none">
                <svg viewBox="0 0 200 400" className="w-full h-full stroke-cyan-400/40 fill-cyan-950/20 stroke-[1.5]">
                  <circle cx="100" cy="40" r="22" />
                  <rect x="92" y="62" width="16" height="15" rx="3" />
                  <path d="M50,85 Q100,75 150,85 L140,200 L60,200 Z" />
                  <path d="M50,85 L30,190 M150,85 L170,190" strokeWidth="12" strokeLinecap="round" />
                  <path d="M65,200 L70,360 M135,200 L130,360" strokeWidth="20" strokeLinecap="round" />
                </svg>
              </div>

              {/* Anatomical Nodes */}
              {nodes
                .filter((node) => node.view === 'both' || node.view === viewAngle)
                .map((node) => {
                  const isSelected = selectedPartKey === node.key;

                  return (
                    <button
                      key={node.key}
                      style={{ top: node.top, left: node.left }}
                      onClick={() => setSelectedPartKey(node.key)}
                      onMouseEnter={() => {
                        setCursorMode('explore');
                        setCursorText(node.name);
                      }}
                      onMouseLeave={() => {
                        setCursorMode('default');
                        setCursorText('');
                      }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    >
                      <span
                        className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                          isSelected
                            ? 'bg-cyan-400/40 animate-ping opacity-100'
                            : 'bg-cyan-500/10 group-hover:bg-cyan-400/20'
                        }`}
                      />
                      <div
                        className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-cyan-400 border-white text-slate-950 scale-125 shadow-[0_0_20px_#38bdf8]'
                            : 'bg-slate-900/90 border-cyan-400/50 text-cyan-300 group-hover:scale-110'
                        }`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-current" />
                      </div>
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 -bottom-7 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950 border-white font-extrabold shadow-md'
                            : 'bg-slate-900/90 text-slate-300 border-white/10 opacity-70 group-hover:opacity-100'
                        }`}
                      >
                        {node.name}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Right Column: Detailed Condition Card with Real Image & Recovery Timeline */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCondition.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl bg-slate-950/90"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                      Anatomical Diagnostic Region
                    </span>
                    <h3 className="text-3xl font-black text-white mt-0.5">
                      {selectedCondition.partName}
                    </h3>
                  </div>

                  <button
                    onClick={() => onOpenBooking(`${selectedCondition.partName} Physiotherapy`)}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    Book Home Consult
                  </button>
                </div>

                {/* Real Patient Treatment Photograph & Explanation */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                    <img
                      src={activeVisual.image}
                      alt={selectedCondition.partName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-extrabold text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-400/30">
                      Real Treatment Session
                    </span>
                  </div>

                  <div className="sm:col-span-7 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold">
                      <Clock size={14} />
                      <span>Estimated Recovery: {activeVisual.timeline}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      {activeVisual.explanation}
                    </p>
                  </div>
                </div>

                {/* Common Symptoms */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-cyan-400" /> Symptoms & Diagnoses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCondition.commonSymptoms.map((sym, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Treatments */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-teal-400" /> Evidence Home Therapy Protocols
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCondition.recommendedTreatments.map((treat, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2">
                        <Activity size={14} className="text-cyan-400 shrink-0" />
                        <span>{treat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched Specialist */}
                {assignedExperts.length > 0 && (
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={assignedExperts[0].image} alt={assignedExperts[0].name} className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40" />
                      <div>
                        <p className="text-xs font-extrabold text-white">Recommended Specialist: {assignedExperts[0].name}</p>
                        <p className="text-[10px] text-cyan-300 font-semibold">{assignedExperts[0].role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenBooking(assignedExperts[0].name)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-colors"
                    >
                      Book With {assignedExperts[0].name.split(' ')[0]}
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
