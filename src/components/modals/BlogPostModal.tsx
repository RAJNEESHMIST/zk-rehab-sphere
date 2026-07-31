import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Tag } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogPostModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-3xl rounded-3xl glass-panel border border-cyan-500/30 p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all z-20"
          >
            <X size={20} />
          </button>

          {/* Cover Header */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-900">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-cyan-300 bg-slate-950/90 px-3 py-1 rounded-full border border-cyan-400/30">
              {post.category}
            </span>
          </div>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4 pb-4 border-b border-white/10">
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <User size={14} /> {post.author} ({post.authorRole})
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {post.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.readTime}
            </span>
          </div>

          <h2 className="text-3xl font-black text-white mb-6">{post.title}</h2>

          {/* Render Markdown/Formatted Content */}
          <div className="prose prose-invert max-w-none text-sm text-slate-200 leading-relaxed space-y-4 mb-8">
            {post.content.split('\n\n').map((para, idx) => (
              <p key={idx}>{para.replace(/#/g, '')}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
            <Tag size={14} className="text-cyan-400" />
            {post.tags.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                #{t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
