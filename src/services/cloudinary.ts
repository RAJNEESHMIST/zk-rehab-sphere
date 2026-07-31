export interface CloudinaryUploadResult {
  imageUrl: string;
  publicId: string;
}

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dhyeoatvi';
export const CLOUDINARY_API_KEY =
  import.meta.env.VITE_CLOUDINARY_API_KEY || '578765569697887';
export const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

/**
 * Uploads an image File or Base64 string directly to Cloudinary using Unsigned Preset
 */
export const uploadToCloudinary = (
  file: File | Blob | string,
  folder: string = 'zk_rehab_uploads',
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const cloudName = CLOUDINARY_CLOUD_NAME;
    const uploadPreset = CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    if (typeof file === 'string') {
      formData.append('file', file);
    } else {
      formData.append('file', file);
    }

    formData.append('upload_preset', uploadPreset);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('folder', folder);

    xhr.open('POST', url, true);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            imageUrl: response.secure_url || response.url,
            publicId: response.public_id,
          });
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        try {
          const errorResp = JSON.parse(xhr.responseText);
          const msg = errorResp.error?.message || 'Cloudinary upload failed. Ensure upload preset allows unsigned uploads.';
          reject(new Error(msg));
        } catch (e) {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during Cloudinary upload.'));
    };

    xhr.send(formData);
  });
};

/**
 * Transforms Cloudinary image URLs with automatic WebP/AVIF formatting and quality optimizations
 */
export const getOptimizedImageUrl = (
  urlOrPublicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: 'auto' | 'auto:good' | 'auto:best';
    format?: 'auto' | 'webp' | 'avif' | 'jpg';
  } = {}
): string => {
  if (!urlOrPublicId) return '';

  const {
    width = 1200,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  const transformation = `f_${format},q_${quality},c_${crop},w_${width}`;

  if (urlOrPublicId.includes('res.cloudinary.com')) {
    return urlOrPublicId.replace('/upload/', `/upload/${transformation}/`);
  }

  // If publicId was passed directly
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${urlOrPublicId}`;
};

/**
 * Safe client-side image removal placeholder
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  console.log(`[Cloudinary Sync] Resource marked for deletion from Firestore: ${publicId}`);
  return true;
};
