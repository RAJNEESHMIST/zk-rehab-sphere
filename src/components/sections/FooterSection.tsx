import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Heart, Globe, Share2, Video, Phone, Star, Award, Shield } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import logoImg from '../../assets/logo.png';

// High-quality physiotherapy placeholder thumbnails for Instagram feed
import service1 from '../../assets/service-1.png';
import service2 from '../../assets/service-2.png';
import service3 from '../../assets/service-3.png';
import service4 from '../../assets/service-4.png';

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

  const latestArticles = [
    { title: 'Recovering Safely From Hemiplegic Stroke', link: '#blog' },
    { title: 'Top 5 Exercises For Decompressing Sciatic Nerve', link: '#blog' },
    { title: 'What To Expect After A Total Knee Replacement', link: '#blog' }
  ];

  const instagramFeeds = [service1, service2, service3, service4];

  return (
    <footer className="relative z-10 pt-20 pb-16 bg-slate-950 border-t border-cyan-500/20 overflow-hidden text-slate-300">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Core Trust Seals Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 pb-12 border-b border-white/10 items-center">
          {/* Emergency Hotline */}
          <div className="flex items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-red-500/20">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
              <Phone className="animate-pulse" size={22} />
            </div>
            <div>
              <span className="text-[10px] text-red-400 font-black uppercase tracking-wider block">Urgent Care Helpline</span>
              <a href="tel:+917340820883" className="text-lg font-black text-white hover:text-red-400 transition-colors">
                +91 7340820883
              </a>
            </div>
          </div>

          {/* Google Star Seal */}
          <div className="flex items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-amber-500/20">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Star className="fill-amber-400 text-amber-400" size={22} />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">Google Business Rating</span>
              <span className="text-lg font-black text-white">4.9 ★ (500+ Reviews)</span>
            </div>
          </div>

          {/* Certifications Badge */}
          <div className="flex items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
              <Award size={22} />
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 font-black uppercase tracking-wider block">Clinical Standards</span>
              <span className="text-sm font-extrabold text-white">IAP Certified Specialists</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info & Certificates */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1 border border-cyan-400/30">
                <img src={logoImg} alt="ZK Rehab Sphere" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                ZK REHAB <span className="text-cyan-400 font-light">SPHERE</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              Chandigarh Tricity's leading evidence-based home visit physiotherapy network. Recover from pain, stroke, and knee replacement in your living room comfort.
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Accreditations</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-900 text-[10px] font-bold text-slate-300 border border-white/5">
                  BPT / MPT Specialists
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 text-[10px] font-bold text-slate-300 border border-white/5">
                  Certified Neuro-Rehab
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Latest Articles Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Latest Health Articles</h4>
            <ul className="space-y-4 text-xs font-semibold">
              {latestArticles.map((article, idx) => (
                <li key={idx} className="group">
                  <a
                    href={article.link}
                    className="hover:text-cyan-400 transition-colors flex items-start gap-2 text-slate-400 group-hover:text-white"
                  >
                    <ArrowRight size={12} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{article.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Instagram Feed Grid Placeholders */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Instagram Feed</h4>
            <div className="grid grid-cols-2 gap-2">
              {instagramFeeds.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  <img
                    src={img}
                    alt={`Instagram upload thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[10px] font-black text-white">
                    @zkrehabsphere
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
              Join 500+ patients in Tricity receiving home recovery tips and guides.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold animate-pulse">
                <CheckCircle2 size={16} />
                <span>Thank you for subscribing!</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} ZK Rehab Sphere. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#admin" onClick={(e) => { e.preventDefault(); window.location.hash = '#admin'; }} className="hover:text-cyan-400 transition-colors">
              Admin Portal
            </a>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built for Chandigarh Tricity with <Heart size={12} className="text-cyan-400 fill-cyan-400" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
