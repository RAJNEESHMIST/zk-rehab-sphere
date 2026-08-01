import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(onComplete, 600);
          }, 300);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(100, prev + increment);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" />

          {/* Center Brand Container */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-24 h-24 mb-6 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-sky-500/20 border border-cyan-400/30 p-3 shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center justify-center"
            >
              <img src={logoImg} alt="ZK Rehab Sphere" className="w-full h-full object-contain rounded-xl" />
              
              {/* Heartbeat pulse badge */}
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg"
              >
                <HeartPulse size={16} />
              </motion.div>
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              ZK REHAB <span className="text-cyan-400">SPHERE</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-8">
              Evidence-Based Rehabilitation Ecosystem
            </p>

            {/* Progress Bar Container */}
            <div className="w-full bg-slate-900/80 rounded-full h-2 p-0.5 border border-white/10 mb-4 relative overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 rounded-full shadow-[0_0_15px_#38bdf8]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Progress % and Status */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Activity size={12} className="animate-spin" /> Loading...
              </span>
              <span className="font-bold text-white">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
