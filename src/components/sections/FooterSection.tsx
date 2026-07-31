import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Heart, Globe, Share2, Video, Phone } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import logoImg from '../../assets/logo.png';

export const FooterSection: React.FC = () => {
  const { settings } = useSiteData();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative z-10 pt-20 pb-10 bg-slate-950 border-t border-cyan-500/20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1 border border-cyan-400/30">
                <img src={logoImg} alt="ZK Rehab Sphere" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                ZK REHAB <span className="text-cyan-400 font-light">SPHERE</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {settings.tagline ||
                "Empowering recovery through advanced diagnostics, personalized therapy, and compassionate care. Your health is our mission."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href={settings.socialLinks?.facebook || 'https://www.facebook.com/share/18UmYRQRDr/'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all">
                <Globe size={16} />
              </a>
              <a href={settings.socialLinks?.instagram || 'https://www.instagram.com/zkrehabsphere'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all">
                <Share2 size={16} />
              </a>
              <a href={settings.socialLinks?.linkedin || 'https://www.linkedin.com/company/zk-rehab-sphere/'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all">
                <Globe size={16} />
              </a>
              <a href={settings.socialLinks?.youtube || 'https://youtube.com/@zkrehabsphere'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all">
                <Video size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              {['Home', 'Services', 'Body Navigator', 'Our Doctors', 'Recovery Journey', 'Resources', 'Articles', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="text-cyan-400" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Coverage Areas */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Tricity Service Coverage</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="p-3 rounded-xl bg-white/5 border border-white/10 font-medium">
                🏙️ <strong className="text-white">Chandigarh</strong> (Sectors 1 to 65 & Surrounding)
              </li>
              <li className="p-3 rounded-xl bg-white/5 border border-white/10 font-medium">
                🏢 <strong className="text-white">Mohali</strong> (Phases 1 to 11, Aerocity & Sector 70-125)
              </li>
              <li className="p-3 rounded-xl bg-white/5 border border-white/10 font-medium">
                🏘️ <strong className="text-white">Kharar</strong> (Landran Road, University Area & Environs)
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Stay Informed</h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Subscribe to receive physical therapy updates, exercise guides, and clinical articles from Sajid Khan & team.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:scale-[1.02] transition-all"
                >
                  Subscribe to Newsletter
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <CheckCircle2 size={16} />
                <span>Thank you for subscribing!</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} ZK Rehab Sphere. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#admin" onClick={(e) => { e.preventDefault(); window.location.hash = '#admin'; }} className="hover:text-cyan-400 transition-colors">
              Admin Portal
            </a>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart size={12} className="text-cyan-400 fill-cyan-400" /> for Chandigarh Tricity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
