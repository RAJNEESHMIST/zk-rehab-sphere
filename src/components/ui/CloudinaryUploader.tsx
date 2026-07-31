import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Trash2, X, Sparkles } from 'lucide-react';
import { uploadToCloudinary, CloudinaryUploadResult, getOptimizedImageUrl } from '../../services/cloudinary';

interface CloudinaryUploaderProps {
  currentImageUrl?: string;
  onUploadSuccess: (result: CloudinaryUploadResult) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  aspectRatio?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  currentImageUrl = '',
  onUploadSuccess,
  onRemove,
  folder = 'zk_rehab_media',
  label = 'Upload Image to Cloudinary',
  aspectRatio = 'aspect-[16/9]',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setErrorMsg(null);
    setIsUploading(true);
    setProgress(0);

    // Generate local preview
    const tempPreview = URL.createObjectURL(file);
    setPreviewUrl(tempPreview);

    try {
      const result = await uploadToCloudinary(file, folder, (percent) => {
        setProgress(percent);
      });
      setPreviewUrl(result.imageUrl);
      onUploadSuccess(result);
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setErrorMsg(err.message || 'Image upload failed. Click retry to try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    setProgress(0);
    setErrorMsg(null);
    if (onRemove) onRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-extrabold uppercase text-slate-300 tracking-wider flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-cyan-400 font-bold lowercase">cdn powered by cloudinary</span>
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full ${aspectRatio} rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center p-4 text-center cursor-pointer ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : errorMsg
            ? 'border-rose-500/40 bg-rose-500/5'
            : previewUrl
            ? 'border-cyan-500/30 bg-slate-950/80'
            : 'border-white/20 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10'
        }`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {/* Render Preview if image exists */}
        {previewUrl && !isUploading ? (
          <div className="relative w-full h-full group">
            <img
              src={getOptimizedImageUrl(previewUrl, { width: 800 })}
              alt="Uploaded Preview"
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs hover:bg-cyan-300 transition-all flex items-center gap-1.5 shadow-lg"
              >
                <RefreshCw size={14} /> Replace Image
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-extrabold text-xs hover:bg-rose-600 transition-all flex items-center gap-1.5 shadow-lg"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>

            {/* Uploaded Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" /> Cloudinary Verified
            </div>
          </div>
        ) : isUploading ? (
          /* Live Upload Progress Indicator */
          <div className="space-y-4 w-full max-w-xs mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
              <UploadCloud size={24} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-white">Uploading to Cloudinary...</span>
                <span className="text-cyan-400">{progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Empty Drag & Drop State */
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mx-auto">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">
                Drag & Drop Image Here or <span className="text-cyan-400 underline">Browse</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message & Retry */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold text-[10px] uppercase hover:bg-rose-600"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
