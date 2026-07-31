import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, MapPin, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSiteData } from '../../context/SiteDataContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialDoctor?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService = '',
  initialDoctor = '',
}) => {
  const { bookAppointment, services, experts, settings } = useSiteData();
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    selectedService: initialService || (services[0]?.title || 'Home Visit Physiotherapy'),
    preferredDoctor: initialDoctor || '',
    locationArea: 'Chandigarh',
    preferredDate: '',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Lock background body scrolling when modal is open to prevent overscroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const waNum = (settings.whatsapp || '917340820883').replace(/[^0-9]/g, '');

  const getWhatsAppUrl = () => {
    const text = `Hello ZK Rehab Sphere! I would like to book a Home Visit Consultation.

📋 *Patient Details*:
• Name: ${formData.patientName}
• Phone: ${formData.patientPhone}
• Email: ${formData.patientEmail}
• Location: ${formData.locationArea} Tricity
• Preferred Date: ${formData.preferredDate || 'Earliest Available'}
• Service: ${formData.selectedService}
• Specialist: ${formData.preferredDoctor || 'Any Available Specialist'}
• Notes/Symptoms: ${formData.notes || 'N/A'}`;

    return `https://wa.me/${waNum}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await bookAppointment(formData);
    setIsSubmitted(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    // Send request directly to WhatsApp
    const url = getWhatsAppUrl();
    window.open(url, '_blank');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-xl rounded-3xl glass-panel border border-cyan-500/30 p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={20} />
          </button>

          {!isSubmitted ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Home Visit Consultation Request
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-1">
                Book Physiotherapy at Home
              </h3>
              <p className="text-xs text-emerald-400 font-semibold mb-6 flex items-center gap-1.5">
                <MessageSquare size={14} /> Requests are automatically sent to WhatsApp for instant response!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="e.g. Gurpreet Singh"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={formData.patientPhone}
                        onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.patientEmail}
                        onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Area / Location</label>
                    <select
                      value={formData.locationArea}
                      onChange={(e) => setFormData({ ...formData, locationArea: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Mohali">Mohali</option>
                      <option value="Kharar">Kharar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Special Service / Condition</label>
                  <input
                    type="text"
                    value={formData.selectedService}
                    onChange={(e) => setFormData({ ...formData, selectedService: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Preferred Specialist (Optional)</label>
                  <select
                    value={formData.preferredDoctor}
                    onChange={(e) => setFormData({ ...formData, preferredDoctor: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Any Available Specialist</option>
                    {experts.map((exp) => (
                      <option key={exp.id} value={exp.name}>
                        {exp.name} ({exp.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Patient Symptoms / Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Briefly describe pain area, stroke status, or surgery details..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:scale-[1.02] transition-all shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <MessageSquare size={18} />
                  <span>Send Request to WhatsApp (+91 7340820883)</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-white">Appointment Request Sent!</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Thank you <strong className="text-cyan-300">{formData.patientName}</strong>! Your request details have been formatted and sent directly to our WhatsApp clinical desk (+91 7340820883).
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                >
                  <MessageSquare size={16} />
                  <span>Re-open WhatsApp Chat</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors text-xs uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
