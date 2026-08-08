import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, ToggleLeft, ToggleRight, Gift, Calendar, AlertCircle } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { Offer } from '../../types';

export const OfferManager: React.FC = () => {
  const { offers, saveOffer, deleteOffer } = useSiteData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Partial<Offer>>({
    id: '',
    title: '',
    description: '',
    isActive: true,
  });

  const [formError, setFormError] = useState('');

  const handleOpenNewForm = () => {
    setCurrentOffer({
      id: `offer-${Date.now()}`,
      title: '',
      description: '',
      isActive: true,
    });
    setIsEditing(true);
    setFormError('');
  };

  const handleOpenEditForm = (offer: Offer) => {
    setCurrentOffer({ ...offer });
    setIsEditing(true);
    setFormError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = async (offer: Offer) => {
    // If setting to active, we might want to deactivate others so only one is active at a time, or let them all be active.
    // Let's deactivate other active ones to keep the UX clean (only one offer displayed).
    const updatedOffer = { ...offer, isActive: !offer.isActive };
    
    if (updatedOffer.isActive) {
      // Deactivate all others
      for (const o of offers) {
        if (o.id !== offer.id && o.isActive) {
          await saveOffer({ ...o, isActive: false });
        }
      }
    }
    
    await saveOffer(updatedOffer);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOffer.title?.trim() || !currentOffer.description?.trim()) {
      setFormError('Please fill in both title and description.');
      return;
    }

    const offerToSave: Offer = {
      id: currentOffer.id || `offer-${Date.now()}`,
      title: currentOffer.title.trim(),
      description: currentOffer.description.trim(),
      isActive: currentOffer.isActive ?? true,
      createdAt: currentOffer.createdAt || new Date().toISOString(),
    };

    // If making active, deactivate others
    if (offerToSave.isActive) {
      for (const o of offers) {
        if (o.id !== offerToSave.id && o.isActive) {
          await saveOffer({ ...o, isActive: false });
        }
      }
    }

    await saveOffer(offerToSave);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer? The banner UI will adjust automatically.')) {
      await deleteOffer(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
            Promotions Management
          </span>
          <h2 className="text-xl font-black text-white">Interactive Offers</h2>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenNewForm}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black shadow-md hover:scale-105 transition-transform"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Create Offer</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Offer Editor Form Card */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass-panel border border-cyan-500/20 p-6 space-y-6"
        >
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {currentOffer.createdAt ? 'Edit Offer Detail' : 'New Offer Setup'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Set details for the announcement ticker displayed under the main site navigation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                Offer Title / Headline (Vibrant & Short)
              </label>
              <input
                type="text"
                name="title"
                value={currentOffer.title || ''}
                onChange={handleFormChange}
                placeholder="e.g. Get 15 Min Free On-Call Consultation!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-300 mb-1">
                Detailed Description (Displayed on larger screens)
              </label>
              <textarea
                name="description"
                value={currentOffer.description || ''}
                onChange={handleFormChange}
                placeholder="e.g. Schedule a call with lead specialist Sajid Khan to get answers to your spinal or stroke recovery questions."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentOffer((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className="text-slate-300 hover:text-white flex items-center gap-2 text-xs font-bold"
              >
                {currentOffer.isActive ? (
                  <ToggleRight size={28} className="text-cyan-400" />
                ) : (
                  <ToggleLeft size={28} className="text-slate-500" />
                )}
                <span>Display on Website immediately</span>
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black shadow-lg hover:scale-105 transition-transform"
              >
                <Save size={16} className="stroke-[2.5]" />
                <span>Save Promotion</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* Offers List View */
        <div className="grid gap-4">
          {offers && offers.length > 0 ? (
            offers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl glass-panel border transition-all ${
                  offer.isActive
                    ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-slate-900/40'
                    : 'border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg border ${
                          offer.isActive
                            ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-400'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        <Gift size={16} />
                      </div>
                      <h4 className="font-bold text-white text-sm">{offer.title}</h4>
                      {offer.isActive && (
                        <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                          Live Banner
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 pl-8">{offer.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 pl-8">
                      <Calendar size={12} />
                      <span>
                        Created: {new Date(offer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        offer.isActive
                          ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title={offer.isActive ? 'Deactivate banner' : 'Activate banner'}
                    >
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleOpenEditForm(offer)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                      title="Edit offer details"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-rose-400 hover:border-rose-400/30 transition-all"
                      title="Delete offer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-2">
              <Gift className="mx-auto text-slate-600" size={32} />
              <h4 className="font-extrabold text-white text-sm">No Offers Active</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create a special offer to run below the navigation bar. You can add, edit, or toggle displays on-the-fly.
              </p>
              <button
                onClick={handleOpenNewForm}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black shadow-md hover:scale-105 transition-transform"
              >
                <Plus size={14} className="stroke-[2.5]" />
                <span>Create One Now</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
