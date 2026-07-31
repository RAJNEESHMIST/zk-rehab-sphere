import React from 'react';
import { motion } from 'framer-motion';

export const HeroFrame3D: React.FC = () => {
  const socials = [
    {
      name: 'WhatsApp',
      subtitle: 'Book Home Visit',
      icon: (
        <svg className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.851-4.414 9.854-9.855.001-2.63-1.024-5.101-2.887-6.968C16.376 1.916 13.91 .893 11.29.893c-5.44 0-9.856 4.415-9.859 9.858-.001 1.502.404 2.97 1.174 4.254L1.625 21.1l6.12-1.605zM17.41 14.53c-.3-.15-1.77-.875-2.04-.975-.27-.1-.47-.15-.67.15-.2.3-.77.975-.94 1.175-.17.2-.35.225-.65.075-.3-.15-1.28-.47-2.435-1.498-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.45.13-.6.13-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.67-1.625-.92-2.225-.24-.58-.48-.5-.67-.512-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.22 5.11 4.52.714.31 1.272.496 1.7.635.717.227 1.37.195 1.885.118.57-.085 1.77-.724 2.02-1.388.25-.664.25-1.23.175-1.388-.075-.15-.275-.225-.575-.375z" />
        </svg>
      ),
      glow: 'shadow-emerald-500/40 border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400',
      url: 'https://wa.me/917340820883',
      orbitRadius: 130,
      orbitSpeed: 38
    },
    {
      name: 'Instagram',
      subtitle: 'Recovery Stories',
      icon: (
        <svg className="w-5 h-5 text-pink-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      glow: 'shadow-pink-500/40 border-pink-500/50 hover:bg-pink-500/10 text-pink-400',
      url: 'https://instagram.com/zkrehabsphere',
      orbitRadius: 160,
      orbitSpeed: 44
    },
    {
      name: 'YouTube',
      subtitle: 'Exercise Videos',
      icon: (
        <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .5 6.163C0 8.024 0 12 0 12s0 3.976.5 5.837a3.003 3.003 0 0 0 2.11 2.108c1.858.555 9.388.555 9.388.555s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108c.5-1.861.5-5.837.5-5.837s0-3.976-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      glow: 'shadow-red-500/40 border-red-500/50 hover:bg-red-500/10 text-red-400',
      url: 'https://youtube.com/@zkrehabsphere',
      orbitRadius: 190,
      orbitSpeed: 50
    },
    {
      name: 'LinkedIn',
      subtitle: 'Clinical Insights',
      icon: (
        <svg className="w-5 h-5 text-blue-400 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      glow: 'shadow-blue-500/40 border-blue-500/50 hover:bg-blue-500/10 text-blue-400',
      url: 'https://linkedin.com/company/zkrehabsphere',
      orbitRadius: 220,
      orbitSpeed: 56
    },
    {
      name: 'Facebook',
      subtitle: 'Patient Community',
      icon: (
        <svg className="w-5 h-5 text-sky-400 fill-current" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
        </svg>
      ),
      glow: 'shadow-sky-500/40 border-sky-500/50 hover:bg-sky-500/10 text-sky-400',
      url: 'https://facebook.com/zkrehabsphere',
      orbitRadius: 250,
      orbitSpeed: 62
    }
  ];

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible select-none perspective-1000">
      
      {/* Cinematic Orbital Ambient Green Glowing Trails */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />

      {/* Orbit Rings (3D Tilted Concentric Glowing Paths pulled closer) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 transform-style-3d rotate-x-[68deg] rotate-y-[-10deg]">
        <div className="absolute w-[260px] h-[260px] rounded-full border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-emerald-400/20 shadow-[0_0_25px_rgba(52,211,153,0.1)]" />
        <div className="absolute w-[380px] h-[380px] rounded-full border border-cyan-400/15 shadow-[0_0_30px_rgba(34,211,238,0.05)]" />
        <div className="absolute w-[440px] h-[440px] rounded-full border border-emerald-400/10 shadow-[0_0_35px_rgba(52,211,153,0.05)]" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-400/10" />
      </div>

      {/* Revolving 3D Glass Social Nodes */}
      <div className="absolute inset-0 flex items-center justify-center">
        {socials.map((social, idx) => {
          return (
            <motion.div
              key={idx}
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: social.orbitSpeed,
                ease: 'linear',
              }}
              style={{
                width: `${social.orbitRadius * 2}px`,
                height: `${social.orbitRadius * 2}px`,
                position: 'absolute',
                transformOrigin: 'center center',
              }}
              className="flex items-start justify-center pointer-events-none"
            >
              {/* Glass sphere node + labels below */}
              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  repeat: Infinity,
                  duration: social.orbitSpeed,
                  ease: 'linear',
                }}
                className="flex flex-col items-center pointer-events-auto"
              >
                {/* 3D Glass Sphere Node */}
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 rounded-full bg-slate-950/80 border-2 flex items-center justify-center shadow-lg hover:scale-125 transition-all duration-300 group cursor-pointer ${social.glow} backdrop-blur-md`}
                >
                  <div className="shrink-0">{social.icon}</div>
                  <div className="absolute -inset-1 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                </a>

                {/* Social Labels below node */}
                <div className="text-center mt-2.5 bg-slate-950/40 px-2 py-0.5 rounded-lg backdrop-blur-xs">
                  <p className="text-[11px] font-black text-white leading-none">{social.name}</p>
                  <p className="text-[8px] font-bold text-slate-400 mt-0.5 leading-none">{social.subtitle}</p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* 3D Holographic Crystal Glass Globe Centerpiece */}
      <div className="relative z-40 flex flex-col items-center justify-center">
        {/* Glowing Pedestal/Base */}
        <div className="absolute bottom-1 w-36 h-8 rounded-full bg-slate-950/95 border-2 border-cyan-400/60 shadow-[0_5px_25px_rgba(34,211,238,0.4)] flex items-center justify-center">
          <div className="w-32 h-6 rounded-full border border-emerald-400/30 animate-pulse" />
        </div>

        {/* 3D Glass Sphere */}
        <motion.div
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut'
          }}
          className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-500/10 via-emerald-500/10 to-slate-950/40 border border-white/20 shadow-[0_0_60px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center text-center p-6 backdrop-blur-xs group"
        >
          <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-cyan-400/5 to-emerald-400/5 border border-cyan-400/20 pointer-events-none" />
          <div className="absolute -inset-1.5 rounded-full border border-cyan-400/10 animate-pulse pointer-events-none" />

          {/* Logo Brand inside Globe */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-400 to-emerald-300 animate-pulse drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
              ZK
            </span>
            <h4 className="text-xs font-black tracking-[0.25em] text-white mt-1">
              REHAB
            </h4>
            <span className="text-[8px] font-black text-cyan-400 tracking-[0.3em] uppercase block mt-0.5">
              SPHERE
            </span>
            
            <p className="text-[7px] font-bold text-slate-300 mt-2 tracking-wide whitespace-nowrap">
              Recover. Rebuild. Rise.
            </p>
          </div>

          {/* Glossy top-light refraction reflection effect */}
          <div className="absolute top-2 left-6 right-6 h-12 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
        </motion.div>
      </div>

      {/* Floating Trust Widgets Diagonally */}
      
      {/* 1. Patient Satisfaction Widget (Top Right) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute top-12 right-2 z-50 p-3 rounded-2xl bg-[#030712]/90 border border-emerald-500/30 shadow-2xl flex items-center gap-3 hidden sm:flex backdrop-blur-md"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current text-emerald-400" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-emerald-400 uppercase font-black tracking-wider">Patient Trust</p>
          <p className="text-xs font-extrabold text-white">500+ Happy Patients</p>
          <p className="text-[8px] text-slate-400 mt-0.5">4.9/5 Average Rating ★★★★★</p>
        </div>
      </motion.div>

      {/* 2. Home Visit Widget (Bottom Left) */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute bottom-12 left-2 z-50 p-3 rounded-2xl bg-[#030712]/90 border border-emerald-500/30 shadow-2xl flex items-center gap-3 hidden sm:flex backdrop-blur-md"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Home Visits</p>
          <p className="text-xs font-extrabold text-white">Tricity Area Coverage</p>
        </div>
      </motion.div>

    </div>
  );
};
