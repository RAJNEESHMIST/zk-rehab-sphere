import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User, Share2, Globe, Tag, Check, ChevronRight, BookOpen } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BlogPost } from '../../types';

interface BlogDetailPageProps {
  slug: string;
  onBack: () => void;
  onSelectBlog: (slug: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug, onBack, onSelectBlog }) => {
  const { blogs } = useSiteData();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const blog = blogs.find((b) => b.slug === slug) || blogs[0];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relatedBlogs = blogs
    .filter((b) => b.slug !== slug && b.status === 'published')
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share error:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!blog) return null;

  return (
    <div className="pt-28 pb-24 relative min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950">
      {/* Sticky Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 z-[10001] transition-all duration-150 shadow-[0_0_10px_#06b6d4]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 text-xs font-extrabold text-slate-300 hover:text-cyan-300 transition-all mb-8"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </button>

        {/* Header Metadata */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-xs font-black text-cyan-300 uppercase tracking-widest">
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Calendar size={14} className="text-cyan-400" />
              Published {blog.publishDate}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Clock size={14} className="text-cyan-400" />
              {blog.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-medium">
            {blog.summary}
          </p>

          {/* Author Capsule & Share */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold text-base">
                {blog.author[0]}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">{blog.author}</h4>
                <p className="text-xs text-slate-400">{blog.authorRole}</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-xs font-extrabold text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 transition-all shadow-md"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </div>

        {/* Large Cover Photo */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-16 border border-cyan-500/30 shadow-2xl bg-slate-900">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Article Body Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Table of Contents Sidebar */}
          <div className="hidden lg:block lg:col-span-4 sticky top-32 space-y-6 p-6 rounded-3xl glass-panel border border-cyan-500/20">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <BookOpen size={16} /> Table of Contents
            </h4>

            <nav className="space-y-2 text-xs font-semibold text-slate-300">
              <a href="#overview" className="block hover:text-cyan-300 transition-colors py-1 border-l-2 border-cyan-400/40 pl-3">
                1. Clinical Overview & Background
              </a>
              <a href="#symptoms" className="block hover:text-cyan-300 transition-colors py-1 border-l-2 border-transparent hover:border-cyan-400/40 pl-3">
                2. Key Symptoms & Diagnostic Criteria
              </a>
              <a href="#protocol" className="block hover:text-cyan-300 transition-colors py-1 border-l-2 border-transparent hover:border-cyan-400/40 pl-3">
                3. Home Visit Rehabilitation Protocol
              </a>
              <a href="#recovery" className="block hover:text-cyan-300 transition-colors py-1 border-l-2 border-transparent hover:border-cyan-400/40 pl-3">
                4. Long-Term Recovery & Prevention
              </a>
            </nav>

            {/* Author Badge */}
            <div className="pt-4 border-t border-white/10 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Clinical Review</span>
              <p className="font-extrabold text-white">Verified by Sajid Khan (MPT Neurology)</p>
            </div>
          </div>

          {/* Article Text Content */}
          <div className="lg:col-span-8 space-y-8 text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
            
            <div id="overview" className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">
                1. Clinical Overview & Background
              </h2>
              <p className="text-slate-300">
                Physical rehabilitation in the home environment provides distinct biomechanical and neurological advantages for patients recovering from acute orthopedic surgeries or neurological events. When therapeutic exercises take place within the patient's immediate living area, functional motor retraining directly translates to daily living activities.
              </p>
              <div className="p-5 rounded-2xl bg-cyan-500/10 border-l-4 border-cyan-400 text-sm text-cyan-200 font-medium">
                <strong>Clinical Takeaway:</strong> Home visit physiotherapy reduces hospital anxiety and allows specialized modalities to be tailored to the patient’s home layout.
              </div>
            </div>

            <div id="symptoms" className="space-y-4 pt-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                2. Key Symptoms & Diagnostic Criteria
              </h2>
              <p className="text-slate-300">
                Early assessment focuses on evaluating range of motion, muscle inhibition, neuro-motor firing patterns, and pain thresholds. Diagnostic therapy protocols established at ZK Rehab Sphere utilize hospital-grade portable equipment including:
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pl-4">
                <li className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-cyan-400 shrink-0" />
                  <span>Portable TENS & Ultrasound therapeutic stimulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-cyan-400 shrink-0" />
                  <span>Motorized Continuous Passive Motion (CPM) devices for joint mobilization</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-cyan-400 shrink-0" />
                  <span>Bio-feedback gait evaluation software</span>
                </li>
              </ul>
            </div>

            <div id="protocol" className="space-y-4 pt-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                3. Home Visit Rehabilitation Protocol
              </h2>
              <p className="text-slate-300">
                The therapeutic process follows a structured 4-stage rehabilitation arc:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Phase 1</span>
                  <h4 className="text-sm font-bold text-white">Pain & Swelling Management</h4>
                  <p className="text-xs text-slate-400">Cryotherapy, gentle lymphatic drainage, and electrical muscle stimulation.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Phase 2</span>
                  <h4 className="text-sm font-bold text-white">Range of Motion Restoration</h4>
                  <p className="text-xs text-slate-400">Passive and active-assisted joint mobilization exercises.</p>
                </div>
              </div>
            </div>

            <div id="recovery" className="space-y-4 pt-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                4. Long-Term Recovery & Prevention
              </h2>
              <p className="text-slate-300">
                Consistency and patient education remain the cornerstone of long-term functional recovery. Patients receive customized home exercise programs and direct phone access to their dedicated specialist throughout the recovery journey.
              </p>
            </div>

            {/* Article Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-cyan-400 mr-2" />
                {blog.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20 pt-16 border-t border-white/10 space-y-8">
            <h3 className="text-2xl font-black text-white">Related Rehabilitation Guides</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectBlog(rel.slug)}
                  className="group rounded-2xl glass-panel border border-white/10 overflow-hidden cursor-pointer hover:border-cyan-400/50 transition-all p-5 space-y-3"
                >
                  <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{rel.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
