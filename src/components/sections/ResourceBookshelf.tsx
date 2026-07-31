import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Search, Filter, Eye, ArrowRight } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { ResourceItem } from '../../types';
import { ResourceModal } from '../modals/ResourceModal';
import { useCursor } from '../../context/CursorContext';

export const ResourceBookshelf: React.FC = () => {
  const { resources } = useSiteData();
  const { setCursorMode, setCursorText } = useCursor();
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Patient Guide', 'Checklist', 'Academic Notes'];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="resources" className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Educational & Patient Materials
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Resource <span className="text-gradient">Bookshelf</span>
          </h2>
          <p className="text-base text-slate-300">
            Download free clinical exercise handbooks, recovery checklists, and physiotherapy academic notes.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="max-w-4xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl glass-panel border border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top.1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* 3D Bookshelf Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredResources.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8, scale: 1.02 }}
              onMouseEnter={() => {
                setCursorMode('read');
                setCursorText('Preview');
              }}
              onMouseLeave={() => {
                setCursorMode('default');
                setCursorText('');
              }}
              onClick={() => setSelectedResource(item)}
              className="rounded-3xl glass-panel border border-cyan-500/20 p-6 flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-[0_20px_45px_-10px_rgba(6,182,212,0.3)] transition-all cursor-pointer group"
            >
              <div>
                {/* Book Cover */}
                <div className="relative w-full h-60 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-900">
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 bg-slate-950/90 px-3 py-1 rounded-full border border-cyan-400/30">
                    {item.readTimeOrPages}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{item.category}</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6 line-clamp-2">
                  {item.summary}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedResource(item);
                }}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 text-xs font-bold text-slate-200 group-hover:text-cyan-300 flex items-center justify-center gap-2 transition-all"
              >
                <Eye size={14} />
                <span>Preview & Download</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
    </section>
  );
};
