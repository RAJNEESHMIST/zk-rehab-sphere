import React from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertCircle, MessageSquare } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export const EmergencyBanner: React.FC = () => {
  const { settings } = useSiteData();
  const phone = settings.phone || '+917340820883';
  const whatsapp = settings.whatsapp || '917340820883';

  return (
    <section className="relative z-20 py-6 bg-gradient-to-r from-red-600 via-amber-600 to-red-700 shadow-xl overflow-hidden border-y border-red-500/30">
      {/* Decorative ambient background pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] animate-pulse" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <AlertCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Need Urgent Home Physiotherapy?
              </h3>
              <p className="text-xs sm:text-sm text-red-100 font-medium">
                Immediate response & certified therapist deployment within 60 minutes across Chandigarh Tricity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-700 hover:bg-slate-100 transition-all font-black text-xs sm:text-sm shadow-md"
            >
              <Phone size={14} className="stroke-[2.5]" />
              <span>Call Now</span>
            </a>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=URGENT%20PHYSIO%20NEEDED:%20I%20need%20urgent%20home%20visit%20physiotherapy%20services.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950/95 border border-red-400 text-white hover:bg-slate-900 transition-all font-bold text-xs sm:text-sm shadow-md"
            >
              <MessageSquare size={14} className="text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
