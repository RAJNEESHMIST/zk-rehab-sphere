import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Activity, Settings } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { Service } from '../../types';
import { CloudinaryUploader } from '../ui/CloudinaryUploader';

export const ServiceManager: React.FC = () => {
  const { services, saveService, deleteService } = useSiteData();
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const handleEditClick = (service: Service) => {
    setEditingService({ ...service });
  };

  const handleCreateClick = () => {
    setEditingService({
      id: `serv-${Date.now()}`,
      title: '',
      shortDesc: '',
      description: '',
      iconName: 'Activity',
      image: '',
      category: 'physiotherapy',
      features: ['Personalized 1-on-1 sessions', 'Certified expert care'],
      gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;
    await saveService(editingService as Service);
    setEditingService(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Services & Treatments Management</h3>
          <p className="text-xs text-slate-400">Add, edit, or delete primary services, text descriptions, and visual cards.</p>
        </div>

        <button
          onClick={handleCreateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-105 transition-all text-xs uppercase tracking-wider"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Edit Form Modal */}
      {editingService && (
        <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 text-white space-y-6 bg-slate-950/90">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="text-lg font-bold uppercase tracking-wide">
              {editingService.title ? 'Edit Service details' : 'Create New Service Card'}
            </h4>
            <button onClick={() => setEditingService(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Pediatric & Geriatric Therapy"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                <select
                  value={editingService.category || 'physiotherapy'}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="physiotherapy">Physiotherapy Care</option>
                  <option value="neurology">Neurological Care</option>
                  <option value="orthopedic">Orthopedic Rehab</option>
                  <option value="wellness">Wellness & Holistic</option>
                  <option value="education">Education & Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Short Description (Sub-heading)</label>
              <input
                type="text"
                required
                value={editingService.shortDesc || ''}
                onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                placeholder="Brief one-line summary..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Detailed Description</label>
              <textarea
                rows={3}
                required
                value={editingService.description || ''}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                placeholder="Comprehensive description of clinical procedure, target patients, and outcomes..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Icon Name (Lucide Icon)</label>
                <select
                  value={editingService.iconName || 'Activity'}
                  onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Activity">Activity (Pulse)</option>
                  <option value="Brain">Brain (Neuro)</option>
                  <option value="Bone">Bone (Orthopedic)</option>
                  <option value="Sparkles">Sparkles (Cupping/Hijama)</option>
                  <option value="Zap">Zap (Electrotherapy)</option>
                  <option value="Accessibility">Accessibility (Mobility)</option>
                  <option value="Dumbbell">Dumbbell (Rehab)</option>
                  <option value="Award">Award (Certificates)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Background Gradient Class</label>
                <input
                  type="text"
                  required
                  value={editingService.gradient || 'from-blue-600 via-indigo-600 to-cyan-500'}
                  onChange={(e) => setEditingService({ ...editingService, gradient: e.target.value })}
                  placeholder="from-... via-... to-..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Key Features (One per line)</label>
              <textarea
                rows={3}
                value={editingService.features?.join('\n') || ''}
                onChange={(e) => setEditingService({ ...editingService, features: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Custom Image Uploader */}
            <CloudinaryUploader
              label="Service Main Visual Photo"
              currentImageUrl={editingService.image}
              folder="zk_rehab_services"
              aspectRatio="aspect-[16/10]"
              onUploadSuccess={(res) => {
                setEditingService({ ...editingService, image: res.imageUrl });
              }}
              onRemove={() => {
                setEditingService({ ...editingService, image: '' });
              }}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
              >
                Save Service Card
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((serv) => (
          <div key={serv.id} className="p-6 rounded-3xl glass-panel border border-cyan-500/20 flex flex-col justify-between hover:border-cyan-400 transition-all duration-300">
            <div className="space-y-4">
              <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-white/5">
                <img src={serv.image} alt={serv.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/90 border border-cyan-500/20 text-[9px] font-black text-cyan-300 uppercase tracking-wider">
                    {serv.category}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-base leading-tight">{serv.title}</h4>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-2 mt-1 leading-relaxed">{serv.shortDesc}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => handleEditClick(serv)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-cyan-500/20"
                title="Edit Service Details"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => deleteService(serv.id)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-500/20"
                title="Delete Service Card"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
