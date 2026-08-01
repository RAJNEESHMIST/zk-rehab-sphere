import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, HelpCircle, PhoneCall, Calendar } from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

export const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am your ZK Rehab AI assistant. How can I help you recover today?' }
  ]);

  const quickPrompts = [
    { label: 'Ask about pain', response: 'Our certified therapists specialize in relieving joint, spinal, and nerve pains. We conduct mechanical diagnosis and decompression exercises directly at home. Tell us, where does it hurt?' },
    { label: 'Book visit', response: 'You can book a Home Visit instantly! Click the "Book Visit" button in the menu or call us at +91 7340820883. We will assign a specialist to visit you today.' },
    { label: 'Check price', response: 'Our physiotherapy sessions start at highly affordable rates (₹500-₹800 per session). There are zero hidden travel costs. We also offer discounted monthly neuro-rehab packages.' }
  ];

  const handlePromptClick = (label: string, response: string) => {
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: label },
      { sender: 'bot', text: response }
    ]);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[9998] pointer-events-auto flex flex-col items-end">
      
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-[330px] sm:w-[360px] h-[450px] rounded-3xl border border-cyan-500/30 glass-panel shadow-2xl flex flex-col overflow-hidden mb-3 bg-slate-950/95"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-900/60 to-slate-900/80 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                  <Bot size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">ZK Rehab Assistant</h4>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed font-medium ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts Options */}
            <div className="p-3 border-t border-white/5 space-y-2 bg-slate-900/40">
              <span className="text-[10px] text-slate-400 font-black uppercase block px-1">Quick Actions</span>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePromptClick(p.label, p.response)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[10px] sm:text-xs font-black text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Form */}
            <div className="p-3 border-t border-white/10 flex gap-2">
              <a
                href="tel:+917340820883"
                className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-all flex items-center justify-center shrink-0"
                title="Call Hotline"
              >
                <PhoneCall size={16} />
              </a>
              <div className="flex-1 text-[11px] text-slate-400 font-bold flex items-center justify-center border border-white/15 rounded-xl px-2.5 bg-white/5">
                Need help? Call +91 7340820883
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all border border-cyan-200/50 cursor-pointer"
      >
        {isOpen ? <X size={22} className="stroke-[2.5]" /> : <MessageSquare size={22} className="stroke-[2.5]" />}
      </motion.button>

    </div>
  );
};
