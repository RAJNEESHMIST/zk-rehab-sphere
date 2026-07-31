import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, Calendar, User, ArrowRight, Sparkles, Tag, Eye } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BlogPost } from '../../types';

interface BlogListPageProps {
  onSelectBlog: (slug: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ onSelectBlog }) => {
  const { blogs } = useSiteData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const publishedBlogs = useMemo(() => {
    return blogs.filter((b) => b.status === 'published');
  }, [blogs]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedBlogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, [publishedBlogs]);

  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [publishedBlogs, searchQuery, selectedCategory]);

  const featuredBlog = useMemo(() => {
    return publishedBlogs.find((b) => b.featured) || publishedBlogs[0];
  }, [publishedBlogs]);

  return (
    <div className="pt-28 pb-24 relative min-h-screen bg-slate-950 text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Banner */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-widest"
          >
            <BookOpen size={16} className="text-cyan-400" />
            <span>Clinical Rehabilitation & Health Insights</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Knowledge Hub for <span className="text-gradient">Home Care Recovery</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Peer-reviewed guides, neurological recovery protocols, and post-operative home exercise handbooks authored by Founder Sajid Khan & team.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto pt-2"
          >
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by condition, stroke, knee, exercise..."
              className="w-full bg-slate-900/90 border border-cyan-500/30 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-xl backdrop-blur-xl"
            />
          </motion.div>
        </div>

        {/* Featured Article Card */}
        {featuredBlog && !searchQuery && selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => onSelectBlog(featuredBlog.slug)}
            className="relative rounded-3xl glass-panel border border-cyan-500/30 overflow-hidden mb-16 shadow-2xl cursor-pointer group hover:border-cyan-400/60 transition-all duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
                    ★ Featured Article
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-xs font-extrabold text-cyan-300">
                    {featuredBlog.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 space-y-4">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-cyan-400" />
                    {featuredBlog.publishDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-cyan-400" />
                    {featuredBlog.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-300 transition-colors leading-tight">
                  {featuredBlog.title}
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {featuredBlog.summary}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User size={14} className="text-cyan-400" />
                    {featuredBlog.author} ({featuredBlog.authorRole})
                  </span>

                  <span className="inline-flex items-center gap-2 text-xs font-black text-cyan-400 group-hover:translate-x-2 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                whileHover={{ y: -8 }}
                onClick={() => onSelectBlog(blog.slug)}
                className="group rounded-3xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between hover:border-cyan-400/50 shadow-xl cursor-pointer transition-all duration-500"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/30 text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-cyan-400" />
                        {blog.publishDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-cyan-400" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between mt-4">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User size={14} className="text-cyan-400" />
                    {blog.author}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 space-y-4">
            <BookOpen size={48} className="mx-auto text-cyan-500/50" />
            <h3 className="text-xl font-bold text-white">No Articles Found</h3>
            <p className="text-sm">Try adjusting your search query or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
