import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Bone, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import { Service } from '../../types';
import { useCursor } from '../../context/CursorContext';

interface GlassCube3DProps {
  service: Service;
  onSelectService: (service: Service) => void;
}

export const GlassCube3D: React.FC<GlassCube3DProps> = ({ service, onSelectService }) => {
  const { setCursorMode, setCursorText } = useCursor();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity size={32} />;
      case 'Brain': return <Brain size={32} />;
      case 'Bone': return <Bone size={32} />;
      case 'GraduationCap': return <GraduationCap size={32} />;
      default: return <Activity size={32} />;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -15;
    const rY = ((x - centerX) / centerX) * 15;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setCursorMode('default');
    setCursorText('');
  };

  return (
    <div className="perspective-1000 w-full h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => {
          setCursorMode('explore');
          setCursorText('Details');
        }}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="h-full rounded-3xl glass-panel border border-cyan-500/20 p-8 flex flex-col justify-between transform-style-3d hover:border-cyan-400/50 hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.3)] transition-colors group cursor-pointer"
        onClick={() => onSelectService(service)}
      >
        <div>
          {/* Service Image Header */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-900">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            {/* Floating Popout Icon */}
            <div className="absolute top-4 left-4 w-14 h-14 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-cyan-400/40 text-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
              {renderIcon(service.iconName)}
            </div>
          </div>

          {/* Title & Category */}
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20">
            {service.category}
          </span>
          <h3 className="text-2xl font-bold text-white mt-3 mb-3 group-hover:text-cyan-300 transition-colors">
            {service.title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {service.shortDesc}
          </p>

          {/* Key Features Bullet List */}
          <div className="space-y-2 mb-6">
            {service.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
          <span>Learn More & Consult</span>
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
