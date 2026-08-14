import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle2, Globe, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { SiteSettings } from '../../types';

export const SiteSettingsEditor: React.FC = () => {
  const { settings, updateSettings } = useSiteData();
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setErrorMsg(null);
    try {
      await updateSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
      setErrorMsg('Unable to save changes. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Global Site Settings & Branding</h3>
          <p className="text-xs text-slate-400">Live edit contact information, hero titles, social links, and SEO metadata.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-panel border border-cyan-500/30 text-white space-y-6">
        {saved && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <CheckCircle2 size={16} />
            <span>Site settings updated & saved successfully! Public website updated live.</span>
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
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Clinic Name</label>
            <input
              type="text"
              value={formData.clinicName || ''}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Phone / WhatsApp Number</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Service Coverage Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Hero Subtitle</label>
          <textarea
            rows={2}
            value={formData.heroSubtitle || ''}
            onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
          />
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">Social Media Links</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-[1.02] transition-all shadow-lg text-xs uppercase tracking-wider"
          >
            <Save size={16} /> Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
