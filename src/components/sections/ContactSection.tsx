import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSiteData } from '../../context/SiteDataContext';

export const ContactSection: React.FC = () => {
  const { settings } = useSiteData();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const waNum = (settings.whatsapp || '917340820883').replace(/[^0-9]/g, '');

  const getWhatsAppUrl = () => {
    const text = `Hello ZK Rehab Sphere! I submitted a consultation inquiry on your website:

👤 *Patient Name*: ${formData.name}
📞 *Phone*: ${formData.phone}
✉️ *Email*: ${formData.email}
📝 *Message/Query*: ${formData.message}`;

    return `https://wa.me/${waNum}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });

    // Redirect request directly to WhatsApp
    const url = getWhatsAppUrl();
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Connect With <span className="text-gradient">ZK Rehab Sphere</span>
          </h2>
          <p className="text-base text-slate-300">
            Reach out for home visit appointments, clinical inquiries, professional collaborations, or patient support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Coverage Location Card */}
              <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 flex items-start gap-4 hover:border-cyan-400/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Service Coverage Area</h4>
                  <p className="text-xs text-cyan-300 font-semibold mt-0.5">Chandigarh Tricity Region</p>
                  <p className="text-xs text-slate-400 mt-1">Chandigarh | Mohali | Kharar</p>
                </div>
              </div>

              {/* Phone Card */}
              <a
                href={`tel:${settings.phone || '+917340820883'}`}
                className="p-6 rounded-3xl glass-panel border border-cyan-500/20 flex items-start gap-4 hover:border-cyan-400/40 transition-all group block"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-400/30 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Call / Direct Consultation</h4>
                  <p className="text-sm font-extrabold text-cyan-300 mt-0.5">{settings.phone || '+91 7340820883'}</p>
                  <p className="text-xs text-slate-400 mt-1">Available for Home Appointments</p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${settings.email || 'zkrehabsphere@gmail.com'}`}
                className="p-6 rounded-3xl glass-panel border border-cyan-500/20 flex items-start gap-4 hover:border-cyan-400/40 transition-all group block"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Email Enquiries</h4>
                  <p className="text-sm font-bold text-cyan-300 mt-0.5">{settings.email || 'zkrehabsphere@gmail.com'}</p>
                  <p className="text-xs text-slate-400 mt-1">Response within 24 hours</p>
                </div>
              </a>
            </div>

            {/* Direct WhatsApp Button */}
            <a
              href={`https://wa.me/${waNum}?text=${encodeURIComponent('Hello ZK Rehab Sphere! I would like to inquire about Home Visit Physiotherapy.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-white font-extrabold text-sm flex items-center justify-center gap-3 transition-all shadow-[0_0_25px_rgba(37,211,102,0.3)]"
            >
              <MessageSquare size={20} className="text-[#25D366]" />
              <span>Chat Directly on WhatsApp (+91 7340820883)</span>
            </a>
          </div>

          {/* Right Column: Contact Form & Visualizer */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-panel border border-cyan-500/30 p-8 text-white shadow-2xl h-full flex flex-col justify-between">
              {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-2xl font-black text-white mb-1">Request Consultation or Callback</h3>
                  <p className="text-xs text-emerald-400 font-semibold mb-6 flex items-center gap-1.5">
                    <MessageSquare size={14} /> Requests automatically open in WhatsApp for quick conversation!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Your Message / Medical Query</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can ZK Rehab Sphere assist your recovery?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:scale-[1.01] transition-all shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <MessageSquare size={18} />
                    <span>Send Inquiry to WhatsApp (+91 7340820883)</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Inquiry Sent to WhatsApp!</h3>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto">
                    Thank you <strong className="text-cyan-300">{formData.name}</strong>. Your message details have been routed to WhatsApp (+91 7340820883).
                  </p>
                  <button
                    onClick={() => {
                      setIsSent(false);
                      setFormData({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Send Another Query
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
