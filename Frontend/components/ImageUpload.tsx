'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadedImage {
  id?: string;
  url: string;
  file_name?: string;
  isNew?: boolean;
}

interface ImageUploadProps {
  specialistId?: string;
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Cloudinary unsigned upload preset - create this in your Cloudinary dashboard
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export default function ImageUpload({
  specialistId,
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload directly to Cloudinary (recommended for frontend)
  const uploadToCloudinary = async (file: File): Promise<UploadedImage | null> => {
    // If Cloudinary is configured, upload directly to Cloudinary
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', `anycomp/specialists/${specialistId || 'temp'}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload to Cloudinary');
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        file_name: data.secure_url,
        isNew: true,
      };
    }

    // Fallback: Upload via backend if Cloudinary not configured on frontend
    // This uses the backend's Cloudinary configuration
    if (specialistId) {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/api/media/upload/${specialistId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      return {
        id: data.data.id,
        url: data.data.file_name,
        file_name: data.data.file_name,
        isNew: true,
      };
    }

    // If no specialistId and no Cloudinary config, create temporary preview
    return {
      url: URL.createObjectURL(file),
      file_name: file.name,
      isNew: true,
    };
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setError(null);

      // Check max images limit
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      // Validate file types
      const validFiles = filesToUpload.filter((file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          setError('Only JPEG, PNG, GIF, and WebP images are allowed');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError('File size must be less than 5MB');
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      setUploading(true);

      try {
        const uploadPromises = validFiles.map((file) => uploadToCloudinary(file));
        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter((r): r is UploadedImage => r !== null);

        onImagesChange([...images, ...successfulUploads]);
      } catch (err: any) {
        console.error('Upload error:', err);
        setError(err.message || 'Failed to upload images');
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, specialistId, onImagesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];

    // If the image has an ID (saved in DB), delete from backend
    if (imageToRemove.id) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/api/media/${imageToRemove.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }

    // Remove from local state
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop images here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs text-gray-400">
              JPEG, PNG, GIF, WebP up to 5MB ({images.length}/{maxImages} images)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={image.id || image.url} className="relative group aspect-square">
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              {/* Primary badge for first image */}
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                  Primary
                </span>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No images uploaded yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
