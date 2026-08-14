import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, FileText } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BlogPost } from '../../types';
import { CloudinaryUploader } from '../ui/CloudinaryUploader';

export const BlogManager: React.FC = () => {
  const { blogs, saveBlog, deleteBlog } = useSiteData();
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateClick = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setEditingBlog({
      id: `post-${Date.now()}`,
      title: '',
      slug: `article-${Date.now()}`,
      summary: '',
      content: '',
      category: 'Neurology',
      author: 'Sajid Khan',
      authorRole: 'Founder & Lead Specialist',
      readTime: '5 min read',
      publishDate: new Date().toISOString().split('T')[0],
      coverImage: '',
      tags: ['Rehabilitation', 'Home Care'],
      status: 'published',
    });
  };

  const handleEditClick = (blog: BlogPost) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setEditingBlog({ ...blog });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.title) return;
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await saveBlog(editingBlog as BlogPost);
      setSuccessMsg('Updated successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        setEditingBlog(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to save article:', err);
      setErrorMsg('Unable to save changes. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Articles & Blog Posts Management</h3>
          <p className="text-xs text-slate-400">Publish, edit, or remove clinical education articles.</p>
        </div>

        <button
          onClick={handleCreateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-105 transition-all text-xs"
        >
          <Plus size={16} /> Create Article
        </button>
      </div>

      {/* Form Modal */}
      {editingBlog && (
        <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 text-white space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="text-lg font-bold">{editingBlog.id ? 'Edit Article' : 'New Article'}</h4>
            <button onClick={() => setEditingBlog(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {successMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <span>✓</span>
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Article Title</label>
              <input
                type="text"
                required
                value={editingBlog.title || ''}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                  setEditingBlog({ ...editingBlog, title, slug: slug || `article-${Date.now()}` });
                }}
                placeholder="e.g. Post-Stroke Home Physical Therapy Protocols"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingBlog.category || 'General'}
                  onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={editingBlog.author || 'Sajid Khan'}
                  onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Read Time</label>
                <input
                  type="text"
                  value={editingBlog.readTime || '5 min read'}
                  onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Summary</label>
              <textarea
                rows={2}
                value={editingBlog.summary || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Article Content (Markdown Supported)</label>
              <textarea
                rows={6}
                value={editingBlog.content || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Cloudinary Cover Image Uploader */}
            <CloudinaryUploader
              label="Article Cover Image (Cloudinary Hosted)"
              currentImageUrl={editingBlog.coverImage}
              folder="zk_rehab_blogs"
              aspectRatio="aspect-[16/9]"
              onUploadSuccess={(res) => {
                setEditingBlog({ ...editingBlog, coverImage: res.imageUrl });
              }}
              onRemove={() => {
                setEditingBlog({ ...editingBlog, coverImage: '' });
              }}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingBlog(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
              >
                Save Article
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs List */}
      <div className="space-y-4">
        {blogs.map((post) => (
          <div key={post.id} className="p-6 rounded-3xl glass-panel border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20">
                {post.category}
              </span>
              <h4 className="font-bold text-white text-base">{post.title}</h4>
              <p className="text-xs text-slate-400">By {post.author} • {post.publishDate} • {post.readTime}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditClick(post)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-cyan-500/20"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => deleteBlog(post.id)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
