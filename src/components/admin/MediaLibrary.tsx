import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle, 
  RefreshCw, Search, Filter, HelpCircle, FileText, ChevronRight, Edit3
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { CloudinaryUploader } from '../ui/CloudinaryUploader';
import { getOptimizedImageUrl } from '../../services/cloudinary';

// Import default project fallback image assets
import zkReceptionImg from '../../assets/zk-reception.png';
import receptionModernImg from '../../assets/reception-modern.png';
import physioTreatmentImg from '../../assets/physio-treatment.png';
import physioGymImg from '../../assets/physio-gym.png';
import heroImg from '../../assets/hero.png';
import aboutImg from '../../assets/about.png';
import service1Img from '../../assets/service-1.png';
import service2Img from '../../assets/service-2.png';
import service3Img from '../../assets/service-3.png';
import service4Img from '../../assets/service-4.png';
import expert1Img from '../../assets/expert-1.png';
import expert2Img from '../../assets/expert-2.png';
import expert3Img from '../../assets/expert-3.png';
import expertManiImg from '../../assets/expert-mani.jpeg';
import expertMehulImg from '../../assets/expert-mehul.jpeg';
import expertNumanImg from '../../assets/expert-numan.jpeg';
import blogBgImg from '../../assets/blog-bg.png';
import founderImg from '../../assets/founder.jpeg';

import strokeRehabImg from '../../assets/treatments/stroke_rehab.png';
import parkinsonsTherapyImg from '../../assets/treatments/parkinsons_therapy.png';
import balanceGaitImg from '../../assets/treatments/balance_gait.png';
import postSurgeryRehabImg from '../../assets/treatments/post_surgery_rehab.png';
import sportsInjuryRehabImg from '../../assets/treatments/sports_injury_rehab.png';
import jointPainManagementImg from '../../assets/treatments/joint_pain_management.png';
import lowerBackPainImg from '../../assets/treatments/lower_back_pain.png';
import bodyNeckImg from '../../assets/treatments/body_neck.png';
import postureCorrectionImg from '../../assets/treatments/posture_correction.png';
import electrotherapyImg from '../../assets/treatments/electrotherapy.png';
import shockwaveTherapyImg from '../../assets/treatments/shockwave_therapy.png';
import roboticRehabImg from '../../assets/treatments/robotic_rehab.png';

interface ImageSlot {
  key: string;
  name: string;
  section: 'Hero' | 'Services' | 'Conditions' | 'Gallery' | 'Doctors' | 'Blog' | 'About / Other';
  category: string;
  description: string;
  defaultImage: string;
}

export const MediaLibrary: React.FC = () => {
  const { settings, updateSettings } = useSiteData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [replacingSlotKey, setReplacingSlotKey] = useState<string | null>(null);
  const [altTextInputs, setAltTextInputs] = useState<Record<string, string>>({});
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);

  const imageSlots: ImageSlot[] = [
    // Hero
    {
      key: 'hero.home',
      name: 'Home Hero Background',
      section: 'Hero',
      category: 'Home Hero',
      description: 'The background image displayed at the very top of the homepage (Hero section).',
      defaultImage: heroImg
    },
    {
      key: 'blog.header',
      name: 'Blog List Header Background',
      section: 'Hero',
      category: 'Blog Header',
      description: 'The hero section background image displayed on the blog list page.',
      defaultImage: blogBgImg
    },
    // Services
    {
      key: 'service.cervicalPain',
      name: 'Cervical Pain Therapy Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Cervical Pain & Cervicogenic Headache.',
      defaultImage: cervicalPainTherapyImg
    },
    {
      key: 'service.lowerBackPain',
      name: 'Lower Back Pain Therapy Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Lower Back Pain / Lumbar Spine.',
      defaultImage: lowerBackPainImg
    },
    {
      key: 'service.postureCorrection',
      name: 'Posture Correction Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Posture Correction & Ergonomics.',
      defaultImage: postureCorrectionImg
    },
    {
      key: 'service.sportsInjury',
      name: 'Sports Injury Rehab Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Sports Injury Rehabilitation.',
      defaultImage: sportsInjuryRehabImg
    },
    {
      key: 'service.jointPain',
      name: 'Joint Pain Management Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Joint Pain Management.',
      defaultImage: jointPainManagementImg
    },
    {
      key: 'service.postSurgery',
      name: 'Post-Surgery Rehab Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Post-Surgery Rehabilitation.',
      defaultImage: postSurgeryRehabImg
    },
    {
      key: 'service.strokeRehab',
      name: 'Stroke Rehabilitation Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Stroke Rehabilitation.',
      defaultImage: strokeRehabImg
    },
    {
      key: 'service.parkinsons',
      name: "Parkinson's Therapy Service",
      section: 'Services',
      category: 'Treatment Cards',
      description: "Service card image for Parkinson's Disease management.",
      defaultImage: parkinsonsTherapyImg
    },
    {
      key: 'service.balanceGait',
      name: 'Balance & Gait Training Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Balance & Gait Training.',
      defaultImage: balanceGaitImg
    },
    {
      key: 'service.shockwave',
      name: 'Shockwave Therapy Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Advanced Shockwave Therapy.',
      defaultImage: shockwaveTherapyImg
    },
    {
      key: 'service.electrotherapy',
      name: 'Electrotherapy Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Advanced Electrotherapy.',
      defaultImage: electrotherapyImg
    },
    {
      key: 'service.robotic',
      name: 'Robotic Rehabilitation Service',
      section: 'Services',
      category: 'Treatment Cards',
      description: 'Service card image for Advanced Robotic Rehabilitation.',
      defaultImage: roboticRehabImg
    },
    // Conditions
    {
      key: 'condition.neck',
      name: 'Neck / Cervical Condition',
      section: 'Conditions',
      category: 'Body Explorer',
      description: 'Condition image for Neck & Cervical hotspots inside the Body Explorer Navigator.',
      defaultImage: bodyNeckImg
    },
    {
      key: 'condition.shoulder',
      name: 'Shoulder Condition',
      section: 'Conditions',
      category: 'Body Explorer',
      description: 'Condition image for Shoulder & Rotator Cuff hotspots inside the Body Explorer Navigator.',
      defaultImage: jointPainManagementImg
    },
    {
      key: 'condition.back',
      name: 'Lumbar Back Condition',
      section: 'Conditions',
      category: 'Body Explorer',
      description: 'Condition image for Lumbar Back & Sciatica hotspots inside the Body Explorer Navigator.',
      defaultImage: lowerBackPainImg
    },
    {
      key: 'condition.hip',
      name: 'Hip & Pelvis Condition',
      section: 'Conditions',
      category: 'Body Explorer',
      description: 'Condition image for Hip & Pelvis hotspots inside the Body Explorer Navigator.',
      defaultImage: postureCorrectionImg
    },
    {
      key: 'condition.knee',
      name: 'Knee Joint Condition',
      section: 'Conditions',
      category: 'Body Explorer',
      description: 'Condition image for Knee Joint hotspots inside the Body Explorer Navigator.',
      defaultImage: postSurgeryRehabImg
    },
    {
      key: 'condition.ankle',
      name: 'Ankle & Foot Condition',
      section: 'Conditions',
      category: 'Body Explorer',
      description: 'Condition image for Ankle & Foot hotspots inside the Body Explorer Navigator.',
      defaultImage: balanceGaitImg
    },
    // Gallery
    {
      key: 'gallery.gal-1',
      name: 'Stroke Rehab Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Stroke Rehabilitation Home Session gallery card.',
      defaultImage: strokeRehabImg
    },
    {
      key: 'gallery.gal-2',
      name: "Parkinson's Tremor Gallery Card",
      section: 'Gallery',
      category: 'Gallery Cards',
      description: "Image displayed for the Parkinson's Tremor Management gallery card.",
      defaultImage: parkinsonsTherapyImg
    },
    {
      key: 'gallery.gal-3',
      name: 'Balance & Gait Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Balance & Gait Mobility Training gallery card.',
      defaultImage: balanceGaitImg
    },
    {
      key: 'gallery.gal-4',
      name: 'Post Knee Replacement Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Post Knee Replacement flexion mobilization gallery card.',
      defaultImage: postSurgeryRehabImg
    },
    {
      key: 'gallery.gal-5',
      name: 'ACL Ligament Rehab Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the ACL Ligament Tear Rehabilitation gallery card.',
      defaultImage: sportsInjuryRehabImg
    },
    {
      key: 'gallery.gal-6',
      name: 'Adhesive Capsulitis Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Adhesive Capsulitis (Frozen Shoulder) Therapy gallery card.',
      defaultImage: jointPainManagementImg
    },
    {
      key: 'gallery.gal-7',
      name: 'Lumbar Disc Decompression Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Lumbar Disc Herniation Decompression gallery card.',
      defaultImage: lowerBackPainImg
    },
    {
      key: 'gallery.gal-8',
      name: 'Cervical Manual Traction Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Cervical Spondylosis Manual Traction gallery card.',
      defaultImage: bodyNeckImg
    },
    {
      key: 'gallery.gal-9',
      name: 'Spinal Alignment Scan Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Spinal Alignment & Posture Scan gallery card.',
      defaultImage: postureCorrectionImg
    },
    {
      key: 'gallery.gal-10',
      name: 'Ultrasound Therapy Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Portable Ultrasound Therapy Session gallery card.',
      defaultImage: electrotherapyImg
    },
    {
      key: 'gallery.gal-11',
      name: 'TENS Stimulation Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Dual Channel TENS Muscle Stimulation gallery card.',
      defaultImage: electrotherapyImg
    },
    {
      key: 'gallery.gal-12',
      name: 'Mechanical Decompression Gallery Card',
      section: 'Gallery',
      category: 'Gallery Cards',
      description: 'Image displayed for the Bedside Mechanical Spine Decompression gallery card.',
      defaultImage: roboticRehabImg
    },
    // Doctors
    {
      key: 'doctor.exp-1',
      name: 'Sajid Khan Profile Photo',
      section: 'Doctors',
      category: 'Profiles',
      description: 'Profile photo for Founder & Lead Physiotherapy Specialist Sajid Khan.',
      defaultImage: founderImg
    },
    {
      key: 'doctor.exp-2',
      name: 'Dr. Mehul Profile Photo',
      section: 'Doctors',
      category: 'Profiles',
      description: 'Profile photo for Orthopedic Physiotherapist Dr. Mehul.',
      defaultImage: expertMehulImg
    },
    {
      key: 'doctor.exp-3',
      name: 'Dr. Mani Profile Photo',
      section: 'Doctors',
      category: 'Profiles',
      description: 'Profile photo for Neuro-Physiotherapist Dr. Mani.',
      defaultImage: expertManiImg
    },
    {
      key: 'doctor.exp-4',
      name: 'Dr. Numan Profile Photo',
      section: 'Doctors',
      category: 'Profiles',
      description: 'Profile photo for Sports Injury Specialist Dr. Numan.',
      defaultImage: expertNumanImg
    },
    // Blog
    {
      key: 'blog.blog-1',
      name: 'Blog Post 1 Cover Image',
      section: 'Blog',
      category: 'Blog Covers',
      description: 'Cover image for the first blog article.',
      defaultImage: strokeRehabImg
    },
    {
      key: 'blog.blog-2',
      name: 'Blog Post 2 Cover Image',
      section: 'Blog',
      category: 'Blog Covers',
      description: 'Cover image for the second blog article.',
      defaultImage: lowerBackPainImg
    },
    {
      key: 'blog.blog-3',
      name: 'Blog Post 3 Cover Image',
      section: 'Blog',
      category: 'Blog Covers',
      description: 'Cover image for the third blog article.',
      defaultImage: postureCorrectionImg
    },
    {
      key: 'blog.blog-4',
      name: 'Blog Post 4 Cover Image',
      section: 'Blog',
      category: 'Blog Covers',
      description: 'Cover image for the fourth blog article.',
      defaultImage: roboticRehabImg
    },
    // About / Other
    {
      key: 'about.founder',
      name: 'Founder About Page Image',
      section: 'About / Other',
      category: 'About Section',
      description: 'Large profile photo of Founder Sajid Khan displayed in the About/Founder section.',
      defaultImage: founderImg
    },
    {
      key: 'about.clinic',
      name: 'Clinic / Setup Photo',
      section: 'About / Other',
      category: 'About Section',
      description: 'Secondary clinical/treatment setup photo shown in the about section.',
      defaultImage: aboutImg
    }
  ];

  const sections = ['All', 'Hero', 'Services', 'Conditions', 'Gallery', 'Doctors', 'Blog', 'About / Other'];

  const filteredSlots = imageSlots.filter((slot) => {
    const matchesSearch = slot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          slot.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          slot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || slot.section === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleUpdateAltText = async (key: string) => {
    const customAlt = altTextInputs[key];
    if (customAlt === undefined) return;

    const currentOverride = settings.imageOverrides?.[key];
    if (!currentOverride) return;

    const updatedOverrides = {
      ...(settings.imageOverrides || {}),
      [key]: {
        ...currentOverride,
        altText: customAlt,
        updatedAt: new Date().toISOString()
      }
    };

    await updateSettings({
      ...settings,
      imageOverrides: updatedOverrides
    });
  };

  const handleResetToDefault = async (key: string) => {
    const updatedOverrides = { ...(settings.imageOverrides || {}) };
    delete updatedOverrides[key];

    await updateSettings({
      ...settings,
      imageOverrides: updatedOverrides
    });

    // Clear local alt text inputs
    setAltTextInputs((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleUploadSuccess = async (key: string, result: { imageUrl: string }) => {
    // Basic image resolution checks dynamically
    const img = new Image();
    img.src = result.imageUrl;
    img.onload = async () => {
      if (img.width < 1200 || img.height < 675) {
        setUploadWarning('Image resolution is lower than recommended (1200x675). The image has been saved but high resolution is preferred.');
      } else {
        setUploadWarning(null);
      }

      const updatedOverrides = {
        ...(settings.imageOverrides || {}),
        [key]: {
          url: result.imageUrl,
          altText: altTextInputs[key] || settings.imageOverrides?.[key]?.altText || '',
          updatedAt: new Date().toISOString(),
          updatedBy: 'Admin'
        }
      };

      await updateSettings({
        ...settings,
        imageOverrides: updatedOverrides
      });

      setReplacingSlotKey(null);
    };
  };

  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-4">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">Centralized Website Image Management</h3>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Authorized admins can dynamically override any image used throughout the ZK Rehab Sphere platform without modifying source code. Overridden images fallback to local high-resolution assets if reset.
        </p>

        {/* Global Stats */}
        <div className="flex gap-6 text-xs font-extrabold text-slate-400">
          <div>
            Total Slots: <span className="text-white">{imageSlots.length}</span>
          </div>
          <div>
            Custom Overrides: <span className="text-cyan-400">{Object.keys(settings.imageOverrides || {}).length}</span>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search slots by name or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveFilter(sec)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === sec
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Warning Banner */}
      {uploadWarning && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{uploadWarning}</span>
          </div>
          <button onClick={() => setUploadWarning(null)} className="text-[10px] font-black uppercase underline">Dismiss</button>
        </div>
      )}

      {/* Grid of Image Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSlots.map((slot) => {
          const override = settings.imageOverrides?.[slot.key];
          const hasOverride = !!override;
          const currentImage = override?.url || slot.defaultImage;
          const isReplacing = replacingSlotKey === slot.key;

          return (
            <div 
              key={slot.key}
              className="p-6 rounded-3xl glass-panel border border-white/10 bg-slate-950/80 shadow-xl space-y-4 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-white/10 text-[9px] font-black uppercase text-slate-300 tracking-wider">
                    {slot.section} → {slot.category}
                  </span>
                  
                  {hasOverride ? (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[9px] font-bold text-cyan-300 uppercase tracking-wide">
                      Custom Active
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">
                      Default Fallback
                    </span>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{slot.name}</h4>
                  <code className="text-[9px] text-cyan-400 font-mono select-all">{slot.key}</code>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-medium">{slot.description}</p>
                </div>

                {/* Comparison Image Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1.5">Current Live Image</span>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/5">
                      <img 
                        src={override?.url ? `${override.url}?v=${new Date(override.updatedAt).getTime()}` : slot.defaultImage} 
                        alt="Current Live"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1.5">Default Fallback</span>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/5 opacity-60">
                      <img 
                        src={slot.defaultImage} 
                        alt="Default Fallback"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Alt Text Form */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-300">Accessibility Alt Text</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={hasOverride ? override.altText || "No alt text set" : "Alt text only editable on custom image overrides"}
                      disabled={!hasOverride}
                      value={altTextInputs[slot.key] !== undefined ? altTextInputs[slot.key] : override?.altText || ''}
                      onChange={(e) => setAltTextInputs(prev => ({ ...prev, [slot.key]: e.target.value }))}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                    />
                    <button
                      onClick={() => handleUpdateAltText(slot.key)}
                      disabled={!hasOverride}
                      className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase bg-slate-900 text-cyan-400 border border-cyan-400/20 hover:border-cyan-400 disabled:opacity-50"
                    >
                      Save Alt
                    </button>
                  </div>
                </div>

                {/* Replace Overlay Dialog */}
                <AnimatePresence>
                  {isReplacing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden border-t border-white/5 pt-4 space-y-3"
                    >
                      <CloudinaryUploader
                        label="Select Custom Image"
                        aspectRatio="aspect-[16/10]"
                        folder="zk_rehab_overrides"
                        onUploadSuccess={(res) => handleUploadSuccess(slot.key, res)}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplacingSlotKey(null)}
                          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <div className="text-[9px] text-slate-500 font-semibold">
                  {hasOverride ? (
                    <>
                      Updated: {new Date(override.updatedAt).toLocaleDateString()} by {override.updatedBy || 'Admin'}
                    </>
                  ) : (
                    "Not customized yet"
                  )}
                </div>

                <div className="flex gap-2">
                  {hasOverride && (
                    <button
                      onClick={() => handleResetToDefault(slot.key)}
                      className="px-3 py-2 rounded-xl text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 size={12} /> Reset to Default
                    </button>
                  )}

                  {!isReplacing && (
                    <button
                      onClick={() => setReplacingSlotKey(slot.key)}
                      className="px-3 py-2 rounded-xl text-[10px] font-black uppercase text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Upload size={12} /> Replace Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
