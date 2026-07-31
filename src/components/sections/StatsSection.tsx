import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    { number: '5,000+', label: 'Successful Home Visits', sub: 'Across Tricity Region', icon: <Users className="text-cyan-400" /> },
    { number: '98.4%', label: 'Patient Satisfaction', sub: 'Rating 4.9 / 5.0', icon: <HeartHandshake className="text-teal-400" /> },
    { number: '8+ Yrs', label: 'Clinical Leadership', sub: 'Certified Specialists', icon: <Award className="text-sky-400" /> },
    { number: '3 Cities', label: 'Tricity Coverage', sub: 'Chandigarh • Mohali • Kharar', icon: <MapPin className="text-emerald-400" /> },
  ];

  return (
    <section className="py-20 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl glass-panel border border-cyan-500/20 text-center hover:border-cyan-400/50 hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.3)] transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                {item.icon}
              </div>
              <h3 className="text-4xl font-black text-white mb-1 group-hover:text-cyan-300 transition-colors font-mono">
                {item.number}
              </h3>
              <p className="text-sm font-bold text-slate-200">{item.label}</p>
              <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
