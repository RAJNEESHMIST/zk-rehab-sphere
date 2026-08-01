import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: "What is ZK Rehab Sphere?",
      a: "ZK Rehab Sphere is Chandigarh Tricity's premier platform for certified, evidence-based home visit physiotherapy. We bring high-grade hospital equipment and clinical specialists directly to your home."
    },
    {
      q: "What conditions do you treat at home?",
      a: "We specialize in Neurological Rehabilitation (Stroke hemiplegia, Parkinson's, Spinal Cord injury), Post-Surgical Joint recovery (Knee/Hip replacement, fracture stiffness), Spine care (Sciatica, Cervical spondylosis), and Sports/Orthopedic injuries."
    },
    {
      q: "Which areas in Tricity do you cover?",
      a: "We actively serve Chandigarh (all sectors), Mohali (including SAS Nagar phases & local sectors), and Kharar. We ensure prompt therapist allocation to these localities."
    },
    {
      q: "Are your physiotherapists certified?",
      a: "Yes, 100% of our therapists are university-certified BPT/MPT clinical specialists with clinical experience in orthopedics, neurology, and cardiopulmonary rehabilitation."
    },
    {
      q: "How do I book a home visit session?",
      a: "You can book instantly using the online booking form on this website, calling our support line (+91 7340820883), or sending a direct WhatsApp message."
    },
    {
      q: "How long does a single session last?",
      a: "A typical treatment session lasts between 45 to 60 minutes, depending on the patient's fatigue tolerance, treatment plan, and condition complexity."
    },
    {
      q: "What equipment do you bring during a home visit?",
      a: "Our therapists carry clinical-grade portable modalities including high-frequency Ultrasound therapy devices, TENS/EMS muscle stimulators, traction belts, and standard exercise kits."
    },
    {
      q: "Is home physiotherapy as effective as clinic visits?",
      a: "Yes, often more effective. Treating patients in their natural environment reduces travel-induced pain, eliminates commute strain, and allows functional exercises adapted directly to home geometry."
    },
    {
      q: "What are the charges per session?",
      a: "Pricing depends on the specific condition, required modalities, and location. Our sessions are highly affordable and completely transparent, starting around ₹500-₹800, with no hidden travel fees."
    },
    {
      q: "Do you offer packages or monthly subscriptions?",
      a: "Yes. For chronic conditions like stroke or post-surgical joint replacement requiring daily sessions, we offer discounted 10-session or monthly packages."
    },
    {
      q: "How quickly can a therapist reach my home in an emergency?",
      a: "For acute pain conditions or urgent requirements, our response team aims to deploy a certified therapist to your doorstep within 60 minutes."
    },
    {
      q: "Can I choose my preferred treatment time slot?",
      a: "Yes, you can schedule visits based on your comfort, whether morning, afternoon, or evening. We confirm slots during appointment scheduling."
    },
    {
      q: "Do you provide dedicated stroke rehabilitation?",
      a: "Yes. We design evidence-based neuro-rehabilitation protocols using Bobath, PNF, and task-oriented gait training to help stroke patients regain independence."
    },
    {
      q: "Can you help with post-surgery knee replacement recovery?",
      a: "Absolutely. We initiate early-stage mobilization, joint range-of-motion exercises, swelling management, and gait training to ensure full recovery after TKR."
    },
    {
      q: "What safety and hygiene protocols do you follow?",
      a: "Our therapists follow strict clinical hygiene: sanitizing all equipment before and after visits, wearing protective face masks, and utilizing disposable sanitization sheets."
    },
    {
      q: "Do you treat elderly patients with severe mobility restrictions?",
      a: "Yes. Home visits are ideal for elderly patients who are bedridden or suffer from balance issues, preventing painful travel stresses."
    },
    {
      q: "Is a doctor's prescription mandatory for physiotherapy?",
      a: "While a prescription is helpful, our specialists conduct a thorough initial clinical assessment and can formulate a diagnostic recovery path without one."
    },
    {
      q: "Do you provide official invoices for medical insurance claims?",
      a: "Yes, we provide digital invoices and session summary reports detailing therapist registrations to assist you in claiming reimbursement."
    },
    {
      q: "What should I prepare before the therapist arrives?",
      a: "Please secure a clean, well-lit room or bed space where the patient can lie down. Ensure the patient is wearing comfortable, loose-fitting clothing."
    },
    {
      q: "Can I get the same therapist for every session?",
      a: "Yes. To maintain progress continuity and trust, we assign a dedicated therapist to handle your entire treatment package from start to finish."
    }
  ];

  return (
    <section id="faq" className="py-24 relative z-10 bg-slate-950">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest">
            <HelpCircle size={16} />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Everything you need to know about booking, therapists, pricing, and treatment safety in Chandigarh Tricity.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 overflow-hidden glass-panel hover:border-cyan-400/30 transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-black text-sm sm:text-base text-white hover:text-cyan-300 transition-colors"
                >
                  <span className="pr-4">{idx + 1}. {faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="p-5 pt-0 border-t border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
