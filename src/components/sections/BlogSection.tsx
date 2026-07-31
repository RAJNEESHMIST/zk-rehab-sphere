import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User, Bookmark, Share2, Sparkles, BookOpen } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BlogPost } from '../../types';
import { BlogPostModal } from '../modals/BlogPostModal';
import { useCursor } from '../../context/CursorContext';

export const BlogSection: React.FC = () => {
  const { blogs } = useSiteData();
  const { setCursorMode, setCursorText } = useCursor();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [shareSuccessId, setShareSuccessId] = useState<string | null>(null);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleShare = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccessId(post.id);
      setTimeout(() => setShareSuccessId(null), 2000);
    }
  };

  return (
    <section id="blog" className="py-24 relative z-10 overflow-hidden bg-slate-950/80">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-extrabold uppercase tracking-widest"
          >
            <BookOpen size={16} className="text-cyan-400" />
            <span>Clinical Knowledge & Patient Handbooks</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
          >
            Evidence-Based Rehabilitation <span className="text-gradient">Articles</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg"
          >
            Read clinical insights, post-operative milestone blueprints, and exercise handbooks authored by Sajid Khan and expert specialists.
          </motion.p>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogs.map((post) => {
            const isBookmarked = bookmarkedIds.includes(post.id);

            return (
              <motion.article
                key={post.id}
                whileHover={{ y: -8, scale: 1.02 }}
                onMouseEnter={() => {
                  setCursorMode('read');
                  setCursorText('Read Article');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                onClick={() => setSelectedPost(post)}
                className="rounded-3xl glass-panel border border-cyan-500/20 p-6 flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(6,182,212,0.3)] transition-all cursor-pointer group bg-slate-950/80"
              >
                <div>
                  {/* Feature Cover Image (Mandatory Photo) */}
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-900">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 bg-slate-950/90 px-3 py-1 rounded-full border border-cyan-400/30">
                      {post.category}
                    </span>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleBookmark(e, post.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                        isBookmarked
                          ? 'bg-cyan-400 text-slate-950 border-cyan-400'
                          : 'bg-slate-950/80 text-slate-300 border-white/20 hover:text-white'
                      }`}
                    >
                      <Bookmark size={14} className={isBookmarked ? 'fill-slate-950' : ''} />
                    </button>
                  </div>

                  {/* Author & Read Time */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-medium">
                    <span className="flex items-center gap-1 font-bold text-cyan-400">
                      <User size={12} /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6 line-clamp-3 font-medium">
                    {post.summary}
                  </p>
                </div>

                {/* Footer Controls: Read & Share */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-black text-cyan-400 group-hover:text-cyan-300">
                    <span>Read Guide</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>

                  <button
                    onClick={(e) => handleShare(e, post)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Share2 size={12} />
                    <span>{shareSuccessId === post.id ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>

              </motion.article>
            );
          })}
        </div>

        {/* View All Articles CTA */}
        <div className="mt-16 text-center">
          <a
            href="#blog"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#blog';
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] text-sm tracking-wider uppercase"
          >
            <BookOpen size={18} />
            <span>Explore All Clinical Articles & Guides</span>
            <ArrowRight size={18} />
          </a>
        </div>

      </div>

      <BlogPostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </section>
  );
};
