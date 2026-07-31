import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ResourceItem } from '../../types';

interface ResourceModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose }) => {
  if (!resource) return null;

  const handleDownload = () => {
    alert(`Thank you for requesting "${resource.title}". The PDF handbook is prepared for download.`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl rounded-3xl glass-panel border border-cyan-500/30 p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="w-full sm:w-44 h-56 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-slate-900">
              <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20">
                {resource.category} • {resource.readTimeOrPages}
              </span>
              <h3 className="text-2xl font-black text-white">{resource.title}</h3>
              <p className="text-xs font-semibold text-slate-400">By {resource.author}</p>
              <p className="text-sm text-slate-200 leading-relaxed">{resource.subtitle}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 mb-6">
            <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-[10px] text-cyan-400">Summary</h4>
            <p>{resource.summary}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-[1.02] transition-all shadow-lg"
            >
              <Download size={18} />
              <span>Download PDF Resource</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
