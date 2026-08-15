import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, GraduationCap, Compass, BookOpen, Eye, Quote, Heart, ArrowRight } from 'lucide-react';
import founderImg from '../../assets/founder.jpeg';

export const FounderPage = ({ onBack, onOpenBooking }) => {
  React.useEffect(() => {
    document.title = "Meet the Founder - ZK Rehab Sphere";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "About Sajid Khan, Founder of ZK Rehab Sphere, final year BPT student at Chandigarh University.");
    }
  }, []);

  const interests = [
    { title: 'Sports Rehabilitation', desc: 'Focusing on athletic performance, injury prevention, and post-traumatic muscle recovery.' },
    { title: 'Neurological Rehabilitation', desc: 'Study and application of motor neuroplasticity, stroke recovery, and coordination therapies.' },
    { title: 'Musculoskeletal Rehabilitation', desc: 'Joint mobility, posture correction, and spinal decompression solutions.' },
    { title: 'Exercise Therapy', desc: 'Customized therapeutic movements to rebuild kinetic strength and flexibility.' },
    { title: 'Patient Education', desc: 'Empowering individuals with reliable, simple recovery guides and spinal safety handbooks.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 relative overflow-hidden text-slate-100">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Back Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-10 font-bold text-xs uppercase tracking-wider group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </button>

        {/* Hero Section / Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait & Quick info */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/20 shadow-[0_20px_50px_rgba(6,182,212,0.25)] bg-slate-950/80 p-5 group"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-900">
                <img 
                  src={founderImg} 
                  alt="Sajid Khan - Founder" 
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">Sajid Khan</h1>
                  <p className="text-sm font-bold text-cyan-400">Founder & Student Physiotherapist</p>
                </div>
                
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-semibold">
                  <GraduationCap size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Education</h4>
                    <p>BPT — Final Year</p>
                    <p className="text-[10px] text-slate-400">Chandigarh University</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio & Core details */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Meet The Founder Intro */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                Meet the Founder
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                About the <span className="text-gradient">Founder</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
                Sajid Khan is the Founder of ZK Rehab Sphere and a final-year Bachelor of Physiotherapy (BPT) student at Chandigarh University. He is passionate about physiotherapy, rehabilitation, patient education, and building a trusted platform for accessible healthcare information and services.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                ZK Rehab Sphere was started with the aim of connecting people with professional physiotherapy care while creating simple and reliable rehabilitation awareness.
              </p>
            </motion.div>

            {/* Approach section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-cyan-500/10 shadow-inner space-y-4"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Compass size={16} /> My Approach
              </h3>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Learn <span className="text-cyan-400 font-light">•</span> Improve <span className="text-cyan-400 font-light">•</span> Serve
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                As a physiotherapy student, Sajid continues to build his clinical knowledge and practical skills through academic learning, clinical exposure, and continuous professional development.
              </p>
            </motion.div>

            {/* Areas of Interest */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <BookOpen size={16} /> Areas of Interest
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {interests.map((interest, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:shadow-lg transition-all group">
                    <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors mb-1.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {interest.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{interest.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision section */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-400/20 flex items-center justify-center text-teal-300 shrink-0">
                <Eye size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-teal-300">My Vision</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                  To grow ZK Rehab Sphere into a trusted physiotherapy and rehabilitation platform that makes professional care and reliable rehabilitation information more accessible to people.
                </p>
              </div>
            </div>

            {/* Note & Quotes */}
            <div className="relative p-8 rounded-3xl bg-slate-900/40 border border-white/10 overflow-hidden">
              <Quote className="absolute -top-4 -left-4 text-cyan-500/5 stroke-[3]" size={100} />
              <div className="relative z-10 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  Founder's Note
                </h4>
                <p className="font-serif italic text-lg leading-relaxed text-slate-200">
                  "I am still learning and growing as a physiotherapy professional. ZK Rehab Sphere is a part of that journey — built with the intention of learning, creating awareness, and making quality rehabilitation more accessible."
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="font-serif italic text-xl font-bold text-gradient block">Sajid Khan</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Founder, ZK Rehab Sphere</span>
                  </div>
                  <Heart className="text-cyan-400 fill-cyan-400/20" size={24} />
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/10">
              <button 
                onClick={() => {
                  window.location.hash = '#services';
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                <span>Explore Our Services</span>
                <ArrowRight size={14} />
              </button>

              <button 
                onClick={() => {
                  window.location.hash = '#experts';
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Meet Our Doctors</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
