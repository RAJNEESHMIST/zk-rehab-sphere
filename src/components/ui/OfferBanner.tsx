import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export const OfferBanner: React.FC = () => {
  const { settings, offers } = useSiteData();
  const activeOffer = offers.find((o) => o.isActive);

  if (!activeOffer) return null;

  const phoneNum = (settings.phone || '+917340820883').replace(/[^0-9]/g, '');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="w-full fixed top-0 left-0 right-0 z-[10001] bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-500 text-slate-950 text-xs font-black shadow-lg overflow-hidden border-b border-cyan-400/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-center">
          <span className="flex items-center gap-1.5 bg-slate-950 text-cyan-300 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider animate-pulse shrink-0">
            <Gift size={10} className="stroke-[2.5]" />
            Offer
          </span>
          <span className="font-extrabold text-slate-950 truncate max-w-sm sm:max-w-xl md:max-w-3xl">
            {activeOffer.title}
          </span>
          <span className="text-[10px] opacity-75 font-semibold hidden sm:inline-block">
            — {activeOffer.description}
          </span>
          <a
            href={`tel:+${phoneNum}`}
            className="inline-flex items-center gap-0.5 text-[10px] font-black text-slate-950 hover:underline shrink-0 pl-1"
          >
            <span>Claim Now</span>
            <ArrowRight size={10} className="stroke-[2.5]" />
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
