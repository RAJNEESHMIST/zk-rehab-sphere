import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, Menu, X, Shield, MapPin } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

interface FloatingNavProps {
  onOpenBooking: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onOpenBooking }) => {
  const { settings, offers } = useSiteData();
  const { isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleHashAndScroll = () => {
      setIsScrolled(window.scrollY > 40);
      
      const hash = window.location.hash;
      if (hash) {
        setActiveSection(hash.replace('#', ''));
      } else if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };

    handleHashAndScroll();
    window.addEventListener('scroll', handleHashAndScroll);
    window.addEventListener('hashchange', handleHashAndScroll);
    
    return () => {
      window.removeEventListener('scroll', handleHashAndScroll);
      window.removeEventListener('hashchange', handleHashAndScroll);
    };
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Conditions', href: '#navigator' },
    { label: 'Services', href: '#services' },
    { label: 'Our Team', href: '#experts' },
    { label: 'Founder', href: '#founder' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
    { label: 'Blog', href: '#blog' },
    { label: 'Collaborations', href: '#collaborations' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#book') {
      onOpenBooking();
      return;
    }
    
    if (['#blog', '#founder', '#testimonials', '#admin', '#collaborations', '#assessment'].includes(href)) {
      setActiveSection(href.replace('#', ''));
      window.location.hash = href;
      return;
    }

    setActiveSection(href.replace('#', ''));
    if (window.location.hash && window.location.hash !== href) {
      window.location.hash = '';
    }
    
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const hasActiveOffer = offers && offers.some(o => o.isActive);

  return (
    <header className={`fixed left-0 right-0 z-[1000] px-3 sm:px-6 transition-all duration-300 pointer-events-none ${
      hasActiveOffer ? 'top-11 sm:top-12' : 'top-0 pt-3 sm:pt-4'
    }`}>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`mx-auto max-w-[1360px] rounded-2xl sm:rounded-3xl pointer-events-auto transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-2.5 px-4 sm:px-6 lg:px-8'
            : 'bg-slate-950/80 backdrop-blur-xl border border-white/15 py-3 px-4 sm:px-6 lg:px-8 shadow-2xl'
        }`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo Brand Container */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-2.5 group shrink-0"
          >
            {/* White Circular Logo Capsule */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white p-1 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform shrink-0">
              <img src={logoImg} alt="ZK Rehab Sphere Logo" className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                ZK REHAB <span className="text-cyan-400 font-semibold">SPHERE</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-cyan-300/80 font-extrabold tracking-wider uppercase hidden md:block">
                Home Visit Physiotherapy
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-full border border-cyan-500/20 shadow-inner shrink-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-2 py-1.5 text-xs font-extrabold rounded-full whitespace-nowrap transition-all duration-300 ${
                    isActive ? 'text-slate-950 font-black' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Direct Phone Call Button */}
            <a
              href={`tel:${settings.phone || '+917340820883'}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-xs font-extrabold text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 transition-all shadow-md shrink-0"
              title="Call ZK Rehab Sphere"
            >
              <Phone size={14} className="stroke-[2.5]" />
              <span className="hidden 2xl:inline whitespace-nowrap">{settings.phone || '+91 7340820883'}</span>
            </a>

            {/* Admin Badge Link */}
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#admin';
              }}
              className={`flex items-center justify-center p-2 rounded-xl border transition-all shrink-0 ${
                isAdmin
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300'
              }`}
              title="Admin Panel"
            >
              <Shield size={14} className={isAdmin ? 'text-emerald-400' : 'text-cyan-400'} />
            </a>

            {/* Book Appointment CTA */}
            <button
              onClick={onOpenBooking}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Calendar size={14} className="stroke-[2.5]" />
              <span className="hidden md:inline whitespace-nowrap">Book Visit</span>
              <span className="hidden sm:inline md:hidden">Book</span>
            </button>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 hover:text-white shrink-0"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="xl:hidden pointer-events-auto mt-2 mx-auto max-w-7xl rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 p-5 shadow-2xl space-y-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-extrabold text-slate-200 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={`tel:${settings.phone || '+917340820883'}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-xs font-black text-cyan-300"
              >
                <Phone size={16} />
                <span>Call {settings.phone || '+91 7340820883'}</span>
              </a>

              <a
                href="#admin"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  window.location.hash = '#admin';
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300"
              >
                <Shield size={16} />
                <span>{isAdmin ? 'Access Admin Panel' : 'Admin Login'}</span>
              </a>


              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold">
                <MapPin size={14} className="text-cyan-400" />
                <span>Chandigarh | Mohali | Kharar</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
