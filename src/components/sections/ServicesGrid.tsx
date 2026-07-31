import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, CheckCircle2, Calendar, Shield } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { GlassCube3D } from '../3d/GlassCube3D';
import { Service } from '../../types';

interface ServicesGridProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onOpenBooking }) => {
  const { services } = useSiteData();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="services" className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Rehabilitation Offerings
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Specialized Care At Your <span className="text-gradient">Doorstep</span>
          </h2>
          <p className="text-base text-slate-300">
            Evidence-based physiotherapy programs designed for stroke recovery, joint replacement, spinal health, and home care across Chandigarh Tricity.
          </p>
        </div>

        {/* 3D Glass Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <GlassCube3D key={service.id} service={service} onSelectService={setSelectedService} />
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-3xl glass-panel border border-cyan-500/30 p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all"
              >
                <X size={20} />
              </button>

              {/* Service Hero Image */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-900">
                <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-wider text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-400/30">
                  {selectedService.category}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-3xl font-black text-white mb-4">{selectedService.title}</h3>
              <p className="text-slate-300 leading-relaxed mb-6">{selectedService.description}</p>

              <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3">Key Clinical Protocol Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {selectedService.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    const title = selectedService.title;
                    setSelectedService(null);
                    onOpenBooking(title);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Calendar size={18} />
                  <span>Book This Service at Home</span>
                </button>

                <button
                  onClick={() => setSelectedService(null)}
                  className="px-6 py-3.5 rounded-xl font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
