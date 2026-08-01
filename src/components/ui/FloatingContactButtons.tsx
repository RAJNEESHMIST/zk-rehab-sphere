import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

interface FloatingContactButtonsProps {
  onOpenBooking: () => void;
}

export const FloatingContactButtons: React.FC<FloatingContactButtonsProps> = ({ onOpenBooking }) => {
  const { settings } = useSiteData();
  const phoneNum = (settings.phone || '+917340820883').replace(/[^0-9]/g, '');
  const waNum = (settings.whatsapp || '917340820883').replace(/[^0-9]/g, '');

  const defaultWaText = encodeURIComponent(
    'Hello ZK Rehab Sphere! I would like to inquire about Home Visit Physiotherapy services across Tricity (Chandigarh, Mohali, Kharar).'
  );

  const { facebook, instagram, linkedin, youtube } = settings.socialLinks || {};

  return (
    <>
      {/* Mobile/Tablet Sticky Bottom CTA Bar (Priority 7 - Sticky 3 Buttons) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-slate-950/95 border-t border-cyan-500/30 p-3 px-4 flex items-center justify-between gap-3 backdrop-blur-xl shadow-2xl">
        {/* Call Button */}
        <a
          href={`tel:+${phoneNum}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs shadow-md"
        >
          <Phone size={14} className="stroke-[2.5]" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${waNum}?text=${defaultWaText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-md"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Book Appointment CTA */}
        <button
          onClick={onOpenBooking}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-black text-xs shadow-md cursor-pointer"
        >
          <Calendar size={14} className="stroke-[2.5]" />
          <span>Book Visit</span>
        </button>
      </div>

      {/* Desktop Floating Actions Container (Standard Right-Bottom Hover Panel) */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-[9999] flex-col gap-3 items-end pointer-events-auto">
        
        {/* Phone Action */}
        <div className="relative group flex items-center">
          <span className="absolute right-16 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-400/40 text-cyan-300 text-xs font-black shadow-xl backdrop-blur-md">
            Call ZK Rehab (+91 {phoneNum})
          </span>

          <button
            onClick={() => window.open(`tel:+${phoneNum}`, '_self')}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_30px_rgba(6,182,212,0.9)] transition-all border border-cyan-200/50 cursor-pointer"
          >
            <Phone size={22} className="animate-pulse" />
          </button>
        </div>

        {/* WhatsApp Action */}
        <div className="relative group flex items-center">
          <span className="absolute right-16 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-400/40 text-emerald-300 text-xs font-black shadow-xl backdrop-blur-md">
            Chat on WhatsApp
          </span>

          <a
            href={`https://wa.me/${waNum}?text=${defaultWaText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.6)] hover:shadow-[0_0_30px_rgba(37,211,102,0.9)] transition-all border border-emerald-200/40"
          >
            <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-sm animate-pulse -z-10" />
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </div>

      </div>
    </>
  );
};
