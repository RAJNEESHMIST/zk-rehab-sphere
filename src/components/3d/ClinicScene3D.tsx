import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Activity, Sparkles } from 'lucide-react';

export const ClinicScene3D: React.FC = () => {
  return (
    <div className="w-full h-[380px] sm:h-[450px] relative flex items-center justify-center overflow-hidden">
      {/* Outer Rotating Cyan Glow Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="absolute w-72 h-72 rounded-full border border-dashed border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.3)]"
      />

      {/* Inner Counter Rotating Teal Glow Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="absolute w-56 h-56 rounded-full border border-teal-400/30 shadow-[0_0_40px_rgba(20,184,166,0.2)]"
      />

      {/* Center 3D Floating Glass Icon Sphere */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="relative z-10 w-32 h-32 rounded-3xl glass-panel border border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center text-cyan-300 gap-2"
      >
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center">
          <Activity size={28} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-white">Evidence Care</span>
      </motion.div>

      {/* Orbiting Satellite Badges */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="absolute top-10 left-10 p-3 rounded-2xl glass-panel border border-cyan-400/30 text-xs font-bold text-white flex items-center gap-2"
      >
        <ShieldCheck size={16} className="text-cyan-400" />
        <span>100% Home Visit</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute bottom-10 right-10 p-3 rounded-2xl glass-panel border border-teal-400/30 text-xs font-bold text-white flex items-center gap-2"
      >
        <HeartPulse size={16} className="text-teal-400" />
        <span>98.4% Recovery Rate</span>
      </motion.div>
    </div>
  );
};
