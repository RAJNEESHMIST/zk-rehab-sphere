import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Car, Stethoscope, Search, Activity, FileSpreadsheet, HeartPulse, CheckCircle2 } from 'lucide-react';
import physioTreatment from '../../assets/physio-treatment.png';
import receptionModern from '../../assets/reception-modern.png';
import zkReception from '../../assets/zk-reception.png';
import physioGym from '../../assets/physio-gym.png';
import heroImg from '../../assets/hero.png';
import aboutImg from '../../assets/about.png';
import service1 from '../../assets/service-1.png';

export const RehabJourney: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Appointment Scheduling',
      desc: 'Seamless booking via phone or WhatsApp. Your preferred home visit timing is confirmed across Chandigarh, Mohali, or Kharar.',
      image: service1,
      icon: <CalendarCheck size={22} className="text-cyan-400" />
    },
    {
      step: '02',
      title: 'Home Arrival & Hygiene Setup',
      desc: 'Our physiotherapist arrives punctually with sanitized equipment, protective wear, and portable clinical therapy modalities.',
      image: zkReception,
      icon: <Car size={22} className="text-teal-400" />
    },
    {
      step: '03',
      title: 'Clinical Assessment',
      desc: 'Thorough evaluation of joint range of motion, muscle strength, nerve reflexes, gait pattern, and pain trigger points.',
      image: aboutImg,
      icon: <Stethoscope size={22} className="text-sky-400" />
    },
    {
      step: '04',
      title: 'Evidence Diagnosis',
      desc: 'Formulating a clinical diagnostic report pinpointing root cause biomechanical dysfunctions or neurological deficits.',
      image: physioGym,
      icon: <Search size={22} className="text-cyan-400" />
    },
    {
      step: '05',
      title: 'Targeted Treatment Session',
      desc: 'Hands-on manual therapy, electrotherapy, PNF neuro-developmental exercises, or spinal decompression performed bedside.',
      image: physioTreatment,
      icon: <Activity size={22} className="text-teal-400" />
    },
    {
      step: '06',
      title: 'Personalized Recovery Plan',
      desc: 'Structured home exercise handbook and daily goal milestones established for patient and family caregivers.',
      image: receptionModern,
      icon: <FileSpreadsheet size={22} className="text-sky-400" />
    },
    {
      step: '07',
      title: 'Continuous Follow-Up',
      desc: 'Regular re-evaluations, video guidance, and long-term joint care maintenance for sustained independence.',
      image: heroImg,
      icon: <HeartPulse size={22} className="text-emerald-400" />
    }
  ];

  return (
    <section id="journey" className="py-24 relative z-10 overflow-hidden bg-slate-950/80">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            7-Step Storytelling Home Visit Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            The <span className="text-gradient">Home Visit Experience</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Every step is transparent, sterile, and guided by certified rehabilitation professionals directly in your home.
          </p>
        </div>

        {/* Storytelling Timeline with Real Photos */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-cyan-400 via-sky-400 to-emerald-400 transform -translate-x-1/2 opacity-30 shadow-[0_0_15px_#38bdf8]" />

          <div className="space-y-16">
            {steps.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full lg:w-1/2">
                    <div className="p-7 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.3)] transition-all group space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 px-3 py-1 rounded-xl">
                          Step {item.step}
                        </span>
                        <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                      </div>

                      <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {item.desc}
                      </p>

                    </div>
                  </div>

                  {/* Real Photo Card Representation */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-xl group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-cyan-400" />
                        <span className="text-xs font-bold text-white tracking-wide">
                          Step {item.step} • {item.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Central Node Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 items-center justify-center z-20 shadow-[0_0_20px_#38bdf8]">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
