import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Clock, CheckCircle2, Calendar, MapPin, Sparkles, BookOpen } from 'lucide-react';
import founderImg from '../../assets/founder.jpeg';
import { useCursor } from '../../context/CursorContext';

export const AboutFounder: React.FC = () => {
  const { setCursorMode, setCursorText } = useCursor();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const milestones = [
    { year: '2016', title: 'Graduated BPT', desc: 'Top academic honors in neurological diagnostic therapy.' },
    { year: '2019', title: 'MPT Neurology Specialization', desc: 'Advanced clinical mastery in stroke & spinal rehab protocols.' },
    { year: '2021', title: 'Home Care Initiative', desc: 'Pioneered evidence-based home visit physiotherapy across Chandigarh.' },
    { year: 'Present', title: 'Founder - ZK Rehab Sphere', desc: 'Leading 500+ successful home patient recoveries across Tricity.' }
  ];

  return (
    <section id="about-founder" className="py-24 relative overflow-hidden bg-slate-950">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header Pill */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-extrabold uppercase tracking-widest"
          >
            <Sparkles size={16} className="text-cyan-400" />
            <span>Leadership & Expertise</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: 3D Mouse Parallax Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md perspective-1000">
              
              {/* Outer Cyan Glow Ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-teal-400/20 to-sky-500/30 blur-2xl opacity-70 pointer-events-none animate-pulse-slow" />

              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ rotateX, rotateY }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                onMouseEnter={() => {
                  setCursorMode('explore');
                  setCursorText('Sajid Khan');
                }}
                className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-400/30 shadow-[0_25px_60px_rgba(6,182,212,0.3)] transform-style-3d group cursor-pointer"
              >
                {/* Large Portrait Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                  <img
                    src={founderImg}
                    alt="Sajid Khan - Founder ZK Rehab Sphere"
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 object-top"
                  />
                  {/* Subtle Gradient Shield */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                {/* Bottom Profile Details Overlay */}
                <div className="p-6 bg-slate-950/90 backdrop-blur-xl border-t border-cyan-500/20">
                  <h3 className="text-2xl font-black text-white tracking-tight">Sajid Khan</h3>
                  <p className="text-sm font-semibold text-cyan-400">Founder & Director</p>
                  
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-bold text-white">
                      <Award size={14} className="text-cyan-400" /> 8+ Yrs Experience
                    </span>
                    <span className="flex items-center gap-1 font-bold text-white">
                      <MapPin size={14} className="text-cyan-400" /> Chandigarh Tricity
                    </span>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>

          {/* Right Column: Biography, Mission, Qualifications & Timeline */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Meet <span className="text-gradient">Sajid Khan</span>
              </h2>
              <p className="text-lg font-medium text-cyan-300">
                Pioneering Ethical, Science-Backed Home Visit Physiotherapy Across North India.
              </p>
              <p className="text-slate-300 text-base leading-relaxed">
                "Our single mission at ZK Rehab Sphere is to deliver hospital-grade clinical precision directly inside the comfortable, familiar environment of the patient’s home. Pain and mobility loss should never require grueling daily clinic commutes."
              </p>
            </div>

            {/* Core Qualifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Academic Qualifications</h4>
                  <p className="text-xs text-slate-300 mt-0.5">BPT, MPT (Neurology Rehabilitation Specialist)</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Specialized Certifications</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Dry Needling, Hijama & Spinal Decompression</p>
                </div>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Clock size={16} /> Clinical & Leadership Journey
              </h4>

              <div className="relative border-l-2 border-cyan-500/30 ml-3 space-y-6 pl-6 pt-2">
                {milestones.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Glowing Bullet */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors" />
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                        {item.year}
                      </span>
                      <h5 className="text-sm font-bold text-white">{item.title}</h5>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Signature Overlay */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Official Director Signature</span>
                <span className="font-serif italic text-2xl font-bold text-gradient tracking-wide">Sajid Khan</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Direct Consultations</span>
                <span className="text-xs font-bold text-cyan-300">+91 7340820883</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
