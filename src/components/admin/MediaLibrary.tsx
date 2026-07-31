import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Image as ImageIcon, FileText, CheckCircle2, ExternalLink } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { CloudinaryUploader } from '../ui/CloudinaryUploader';
import { getOptimizedImageUrl } from '../../services/cloudinary';

export const MediaLibrary: React.FC = () => {
  const { media, saveMedia, deleteMedia } = useSiteData();

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-4">
        <h3 className="text-lg font-bold text-white">Upload Assets & Photos to Cloudinary CDN</h3>
        <p className="text-xs text-slate-400 max-w-lg">
          Upload doctor photos, home visit clinic photos, exercise demonstrations, or clinic logos. Images are hosted on Cloudinary CDN with automatic WebP/AVIF compression.
        </p>

        <CloudinaryUploader
          label="Gallery & Assets Cloudinary Upload Zone"
          folder="zk_rehab_gallery"
          aspectRatio="aspect-[21/9]"
          onUploadSuccess={async (res) => {
            await saveMedia({
              id: `media-${Date.now()}`,
              name: res.publicId.split('/').pop() || `Photo ${Date.now()}`,
              url: res.imageUrl,
              type: 'image',
              sizeBytes: 1024 * 200,
              uploadedAt: new Date().toISOString().split('T')[0],
            });
          }}
        />
      </div>

      {/* Media Gallery */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cloudinary Asset Library ({media.length})</h4>
          <span className="text-[10px] text-cyan-400 font-bold">Auto-Optimized CDN URLs</span>
        </div>

        {media.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 border border-white/10 rounded-2xl bg-white/5">
            No custom media files uploaded yet. Drag & drop an image above to get started!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-white/10 bg-slate-900 p-2 space-y-2">
                {item.type === 'image' ? (
                  <img src={getOptimizedImageUrl(item.url, { width: 400 })} alt={item.name} className="w-full h-32 object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-32 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400">
                    <FileText size={32} />
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-300 font-bold truncate max-w-[100px]">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/10"
                      title="Open Cloudinary URL"
                    >
                      <ExternalLink size={12} />
                    </a>
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20"
                      title="Delete Asset"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
