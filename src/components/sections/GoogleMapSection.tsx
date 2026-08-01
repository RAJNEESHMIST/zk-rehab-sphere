import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck } from 'lucide-react';

export const GoogleMapSection: React.FC = () => {
  return (
    <section id="map" className="py-16 relative z-10 overflow-hidden bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest">
            <MapPin size={16} />
            <span>Serving Chandigarh Tricity Area</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Our Service <span className="text-gradient">Coverage Zone</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Providing direct-to-home physical therapy visits within 60 minutes across Chandigarh, Mohali, and Kharar. Check our map details below.
          </p>
        </div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl glass-panel relative h-[400px] w-full"
        >
          {/* Interactive Google Map Iframe (focused on Chandigarh Tricity area) */}
          <iframe
            title="ZK Rehab Sphere Service Coverage Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109741.0291291132!2d76.69348827552554!3d30.73506264426543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0be66ec96b%3A0xa5ff90f9c136c5a!2sChandigarh!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.95)' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Coverage overlay card */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-6 sm:right-auto p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md shadow-2xl max-w-sm space-y-2">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span className="text-cyan-400">●</span> 60-Minute Response Zones
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              We deploy therapists directly from micro-hubs in Chandigarh, Phase 7 Mohali, and Kharar Road to ensure minimal commute and maximum recovery focus.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
