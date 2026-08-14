import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, UserCheck, Star } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { Expert } from '../../types';
import { CloudinaryUploader } from '../ui/CloudinaryUploader';

export const ExpertManager: React.FC = () => {
  const { experts, saveExpert, deleteExpert } = useSiteData();
  const [editingExpert, setEditingExpert] = useState<Partial<Expert> | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEditClick = (expert: Expert) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setEditingExpert({ ...expert });
  };

  const handleCreateClick = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setEditingExpert({
      id: `exp-${Date.now()}`,
      name: '',
      role: 'Physiotherapy Specialist',
      qualification: 'BPT',
      experienceYears: 5,
      rating: 4.9,
      reviewsCount: 50,
      specializations: ['Stroke Rehabilitation', 'Post-Op Rehab'],
      biography: '',
      availability: 'Mon - Sat',
      location: 'Chandigarh & Mohali',
      image: '',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpert || !editingExpert.name) return;
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await saveExpert(editingExpert as Expert);
      setSuccessMsg('Updated successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        setEditingExpert(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to save expert:', err);
      setErrorMsg('Unable to save changes. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Doctors & Specialists Management</h3>
          <p className="text-xs text-slate-400">Add, edit, or delete expert profiles visible on the public site.</p>
        </div>

        <button
          onClick={handleCreateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-105 transition-all text-xs"
        >
          <Plus size={16} /> Add New Doctor
        </button>
      </div>

      {/* Edit Form Modal */}
      {editingExpert && (
        <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 text-white space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="text-lg font-bold">{editingExpert.id ? 'Edit Doctor Profile' : 'New Doctor Profile'}</h4>
            <button onClick={() => setEditingExpert(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={editingExpert.name || ''}
                  onChange={(e) => setEditingExpert({ ...editingExpert, name: e.target.value })}
                  placeholder="Dr. John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Role / Title</label>
                <input
                  type="text"
                  required
                  value={editingExpert.role || ''}
                  onChange={(e) => setEditingExpert({ ...editingExpert, role: e.target.value })}
                  placeholder="Senior Physiotherapist"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={editingExpert.qualification || ''}
                  onChange={(e) => setEditingExpert({ ...editingExpert, qualification: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Experience Years</label>
                <input
                  type="number"
                  value={editingExpert.experienceYears || 5}
                  onChange={(e) => setEditingExpert({ ...editingExpert, experienceYears: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Coverage Location</label>
                <input
                  type="text"
                  value={editingExpert.location || ''}
                  onChange={(e) => setEditingExpert({ ...editingExpert, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Specializations (Comma separated)</label>
              <input
                type="text"
                value={editingExpert.specializations?.join(', ') || ''}
                onChange={(e) =>
                  setEditingExpert({
                    ...editingExpert,
                    specializations: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Biography</label>
              <textarea
                rows={3}
                value={editingExpert.biography || ''}
                onChange={(e) => setEditingExpert({ ...editingExpert, biography: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Cloudinary Profile Photo Uploader */}
            <CloudinaryUploader
              label="Doctor Profile Photo (Cloudinary Hosted)"
              currentImageUrl={editingExpert.image}
              folder="zk_rehab_experts"
              aspectRatio="aspect-[4/3]"
              onUploadSuccess={(res) => {
                setEditingExpert({ ...editingExpert, image: res.imageUrl });
              }}
              onRemove={() => {
                setEditingExpert({ ...editingExpert, image: '' });
              }}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingExpert(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
              >
                Save Doctor Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doctors Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((doc) => (
          <div key={doc.id} className="p-6 rounded-3xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover border border-cyan-400/30" />
              <div>
                <h4 className="font-bold text-white text-base">{doc.name}</h4>
                <p className="text-xs text-cyan-400 font-semibold">{doc.role}</p>
                <p className="text-[10px] text-slate-400">{doc.qualification}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{doc.experienceYears}+ Yrs Experience</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(doc)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-cyan-500/20"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => deleteExpert(doc.id)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
