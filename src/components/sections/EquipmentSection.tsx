import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, Activity, Dumbbell } from 'lucide-react';
import portableElectrotherapy from '../../assets/portable-electrotherapy.png';
import physioTreatment from '../../assets/physio-treatment.png';
import physioGym from '../../assets/physio-gym.png';
import zkReception from '../../assets/zk-reception.png';

export const EquipmentSection: React.FC = () => {
  const equipments = [
    {
      title: 'Clinical Portable Ultrasound',
      desc: 'High-frequency sound waves to reduce deep tissue inflammation, accelerate muscle healing, and alleviate joint pain.',
      icon: <Cpu className="text-cyan-400" />,
      image: portableElectrotherapy,
      badge: 'FDA Approved'
    },
    {
      title: 'TENS & Muscle Stimulator',
      desc: 'Dual-channel electrical nerve stimulation to block chronic pain signals and prevent muscle atrophy during stroke recovery.',
      icon: <Zap className="text-teal-400" />,
      image: physioTreatment,
      badge: 'Hospital Grade'
    },
    {
      title: 'Spinal Decompression Belts',
      desc: 'Mechanical decompression belts to relieve nerve pinching caused by herniated discs or severe sciatica flare-ups.',
      icon: <Activity className="text-sky-400" />,
      image: zkReception,
      badge: 'Certified Spine Care'
    },
    {
      title: 'Active Mobility & Resistance Kit',
      desc: 'Specialized therapy bands, balance boards, and posture trainers tailored for functional gait retraining at home.',
      icon: <Dumbbell className="text-emerald-400" />,
      image: physioGym,
      badge: 'Hygiene Assured'
    }
  ];

  return (
    <section id="equipment" className="py-24 relative z-10 overflow-hidden bg-slate-950/80">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={16} className="text-cyan-400" />
            <span>Clinical Grade Technologies Brought Home</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Our Portable <span className="text-gradient">Physiotherapy Equipment</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            No commute needed. We carry sanitised, clinical-grade rehabilitation modalities to conduct comprehensive sessions at your bedside.
          </p>
        </div>

        {/* Equipment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {equipments.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)] transition-all flex flex-col sm:flex-row h-full"
            >
              {/* Image Side */}
              <div className="w-full sm:w-2/5 relative aspect-square sm:aspect-auto min-h-[200px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-white/10 text-[10px] font-black uppercase text-cyan-300">
                  {item.badge}
                </span>
              </div>

              {/* Details Side */}
              <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-1.5 text-xs text-cyan-400 font-extrabold">
                  <span>● Hospital Grade Sanitized</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
