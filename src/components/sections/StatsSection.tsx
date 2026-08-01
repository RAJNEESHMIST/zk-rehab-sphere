import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Award, ShieldCheck, HeartHandshake, Star } from 'lucide-react';

interface CounterProps {
  value: number;
  suffix: string;
  duration?: number;
}

const CountUp: React.FC<CounterProps> = ({ value, suffix, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 16);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  // Special presentation for float rating numbers
  if (value === 4.9) {
    return <span ref={ref}>4.9{suffix}</span>;
  }

  return <span ref={ref}>{count}{suffix}</span>;
};

export const StatsSection: React.FC = () => {
  const stats = [
    { value: 500, suffix: '+', label: 'Patients Treated', sub: 'Successful Recoveries', icon: <Users className="text-cyan-400" /> },
    { value: 1000, suffix: '+', label: 'Sessions Completed', sub: 'Home visits completed', icon: <HeartHandshake className="text-teal-400" /> },
    { value: 4.9, suffix: '★', label: 'Google Rating', sub: 'Verified Patient Feedback', icon: <Star className="text-amber-400 fill-amber-400" /> },
    { value: 5, suffix: '+', label: 'Years Experience', sub: 'Clinical Excellence', icon: <Award className="text-sky-400" /> },
  ];

  return (
    <section className="py-16 relative z-10 overflow-hidden bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 text-center hover:border-cyan-400/50 hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.3)] transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                {item.icon}
              </div>
              <h3 className="text-3xl sm:text-5xl font-black text-white mb-1 group-hover:text-cyan-300 transition-colors font-mono">
                <CountUp value={item.value} suffix={item.suffix} />
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
