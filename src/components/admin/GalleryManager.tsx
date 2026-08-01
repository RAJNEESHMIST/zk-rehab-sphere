import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, CheckCircle2, Image as ImageIcon, MapPin, Tag } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { GalleryItem } from '../../types';
import { CloudinaryUploader } from '../ui/CloudinaryUploader';

export const GalleryManager: React.FC = () => {
  const { gallery, saveGalleryItem, deleteGalleryItem } = useSiteData();
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Neurological Care');
  const [image, setImage] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Chandigarh');

  const categories = ['Neurological Care', 'Orthopedic Rehab', 'Spine Care', 'Advanced Equipment'];
  const locations = ['Chandigarh', 'Mohali', 'Kharar'];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Neurological Care');
    setImage('');
    setBeforeImage('');
    setAfterImage('');
    setCaption('');
    setLocation('Chandigarh');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setImage(item.image);
    setBeforeImage(item.beforeImage || '');
    setAfterImage(item.afterImage || '');
    setCaption(item.caption);
    setLocation(item.location);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image || !caption) return;

    const newItem: GalleryItem = {
      id: editingItem ? editingItem.id : `gal-${Date.now()}`,
      title,
      category,
      image,
      caption,
      location,
      ...(beforeImage && afterImage ? { beforeImage, afterImage } : {})
    };

    await saveGalleryItem(newItem);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Manage Patient Recovery Gallery</h2>
          <p className="text-xs text-slate-400">Add, edit, or delete real home session photographs showing recovery progress.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Photo Card</span>
        </button>
      </div>

      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-4"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {editingItem ? 'Edit Photo Card' : 'Add New Photo Card'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Session Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Stroke Rehabilitation Home Session"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Main Image Controls */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-t border-white/5 pt-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Main Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <CloudinaryUploader
                  label="Or Upload Main Image"
                  aspectRatio="aspect-[21/9]"
                  currentImageUrl={image}
                  onUploadSuccess={(res) => setImage(res.imageUrl)}
                  onRemove={() => setImage('')}
                />
              </div>
            </div>

            {/* Before / After Optional Progress Controls */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Before Image URL (Optional)</label>
                <input
                  type="url"
                  value={beforeImage}
                  onChange={(e) => setBeforeImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <CloudinaryUploader
                  label="Or Upload Before Image"
                  aspectRatio="aspect-[21/9]"
                  currentImageUrl={beforeImage}
                  onUploadSuccess={(res) => setBeforeImage(res.imageUrl)}
                  onRemove={() => setBeforeImage('')}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">After Image URL (Optional)</label>
                <input
                  type="url"
                  value={afterImage}
                  onChange={(e) => setAfterImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <CloudinaryUploader
                  label="Or Upload After Image"
                  aspectRatio="aspect-[21/9]"
                  currentImageUrl={afterImage}
                  onUploadSuccess={(res) => setAfterImage(res.imageUrl)}
                  onRemove={() => setAfterImage('')}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Session Description / Caption</label>
              <textarea
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe the clinical assessment, mobilization tools, and patient outcomes..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-[1.02] transition-all cursor-pointer"
              >
                Save Card
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden flex flex-col justify-between group">
            <div className="relative aspect-[4/3] bg-slate-950">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/90 border border-cyan-500/20 text-[9px] font-black text-cyan-300 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/90 border border-indigo-500/20 text-[9px] font-black text-indigo-300 uppercase tracking-wider">
                  {item.location}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-white line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.caption}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 transition-colors border border-white/10 hover:border-cyan-500/20"
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => deleteGalleryItem(item.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 transition-colors border border-white/10 hover:border-rose-500/20"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
