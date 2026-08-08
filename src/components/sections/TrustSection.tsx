import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, HeartPulse, Award, CheckCircle2, Home } from 'lucide-react';

// Import high-resolution local images
import service1Img from '../../assets/service-1.png';
import parkinsonsTherapyImg from '../../assets/treatments/parkinsons_therapy.png';
import lowerBackPainImg from '../../assets/treatments/lower_back_pain.png';
import postSurgeryRehabImg from '../../assets/treatments/post_surgery_rehab.png';
import fallbackImg from '../../assets/physio-treatment.png';

interface FeatureCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

export const TrustSection: React.FC = () => {
  const cards: FeatureCard[] = [
    {
      id: 'assessment',
      badge: 'CLINICAL ASSESSMENT',
      title: 'Certified Doctor Assessment',
      description: 'Start with a professional assessment to understand your condition, movement, strength, and recovery needs.',
      image: service1Img,
      icon: <UserCheck className="text-cyan-400" size={20} />
    },
    {
      id: 'home-visit',
      badge: 'HOME VISIT',
      title: 'Sanitized Home Therapy',
      description: 'Receive professional physiotherapy in the comfort of your home with a clean and patient-focused approach.',
      image: parkinsonsTherapyImg,
      icon: <Home className="text-teal-400" size={20} />
    },
    {
      id: 'evidence-based',
      badge: 'EVIDENCE-BASED',
      title: 'Evidence-Based Protocols',
      description: 'Treatment plans follow clinically informed rehabilitation techniques selected for your condition and goals.',
      image: lowerBackPainImg,
      icon: <HeartPulse className="text-sky-400" size={20} />
    },
    {
      id: 'functional-rehab',
      badge: 'PERSONALIZED CARE',
      title: 'Supervised Functional Rehab',
      description: 'Progressive rehabilitation helps improve movement, strength, mobility, and everyday function.',
      image: postSurgeryRehabImg,
      icon: <Award className="text-cyan-400" size={20} />
    }
  ];

  return (
    <section id="trust" className="py-24 relative overflow-hidden bg-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-extrabold uppercase tracking-widest">
            Why Choose ZK Rehab Sphere
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Professional Care. <span className="text-gradient">Personal Recovery.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Trusted home physiotherapy focused on safe treatment, clinical quality, and your individual recovery goals.
          </p>
        </div>

        {/* 4 Equal-width Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col rounded-[24px] overflow-hidden glass-panel border border-white/10 hover:border-cyan-400/30 bg-slate-950/80 shadow-xl transition-all duration-300"
            >
              {/* Image Area */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 border-b border-white/5">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImg;
                  }}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Floating Badge & Icon */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-400/20 text-[9px] font-black uppercase text-cyan-300 backdrop-blur-md">
                    {card.badge}
                  </span>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-950/80 border border-white/20 flex items-center justify-center backdrop-blur-md">
                  {card.icon}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ethical Statement and Trust Strip */}
        <div className="max-w-4xl mx-auto mt-16 text-center space-y-8 border-t border-white/5 pt-10">
          <p className="text-xs sm:text-sm text-slate-400 italic font-semibold max-w-2xl mx-auto">
            "Patient-first care built around comfort, dignity, clear communication, and informed treatment decisions."
          </p>

          {/* Static Trust Row Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-extrabold bg-white/5 border border-white/10 rounded-2xl py-4 px-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400" />
              <span>Professional Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400" />
              <span>Home-Based Care</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400" />
              <span>Personalized Treatment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400" />
              <span>Patient-Centered Approach</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
