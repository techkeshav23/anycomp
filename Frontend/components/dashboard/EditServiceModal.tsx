'use client';

import { useState } from 'react';
import { X, Upload, Loader2, Image as ImageIcon, Check } from 'lucide-react';

interface ServiceOffering {
  id?: string;
  title: string;
  description?: string;
  price?: number;
  is_selected?: boolean;
}

interface UploadedImage {
  id?: string;
  url: string;
  file_name?: string;
  isNew?: boolean;
}

interface Specialist {
  id: string;
  title: string;
  description: string;
  base_price: number;
  platform_fee: number;
  final_price: number;
  duration_days: number;
  is_draft: boolean;
  verification_status: string;
  service_category?: string;
  supported_company_types?: string[];
  serviceOfferings?: ServiceOffering[];
  media?: { id: string; file_name: string; display_order: number }[];
}

interface EditServiceModalProps {
  specialist: Specialist;
  onClose: () => void;
  onSave: (data: any) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

// Check if Cloudinary is properly configured (not placeholder values)
const isCloudinaryConfigured = 
  CLOUDINARY_CLOUD_NAME && 
  CLOUDINARY_UPLOAD_PRESET && 
  CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  CLOUDINARY_UPLOAD_PRESET !== 'your_unsigned_preset';

// Service Categories (can only choose 1)
const SERVICE_CATEGORIES = [
  'Incorporation of a new company',
  'Monthly Company Secretary subscription',
  'Opening of Bank Account',
  'Appointment of Secretary',
  'Appointment/Resignation of Director',
  'Change of Nature of Business',
];

// Supported Company Types
const COMPANY_TYPES = [
  { id: 'sdn_bhd', label: 'Private Limited - Sdn. Bhd' },
  { id: 'bhd', label: 'Public Limited - Bhd.' },
];

// Additional Offerings with descriptions
const AVAILABLE_OFFERINGS = [
  { title: 'Company Secretary Subscription', description: 'Enjoy a full-year Company Secretary Subscription', price: 888 },
  { title: 'Opening of a Bank Account', description: 'Complimentary assistance with Bank Account Opening', price: 0 },
  { title: 'Access Company Records and SSM Forms', description: 'Full access to company documents online', price: 50 },
  { title: 'Priority Filing', description: 'Get your documents filed for compliance and audit promptly - within 24 hours', price: 100 },
  { title: 'Registered Office Address Use', description: 'Use of Official Company Registered Office for online/e-mail forwarding', price: 200 },
  { title: 'Compliance Calendar Setup', description: 'Get automated reminders for all statutory deadlines', price: 0 },
  { title: 'First Share Certificate Issued Free', description: 'Receive your first official share certificate at no cost', price: 0 },
  { title: 'CTC Delivery & Courier Handling', description: 'Have your company documents and statutory reports delivered securely by post', price: 30 },
  { title: 'Chat Support', description: 'Dedicated live chat support for compliance, filing, and technical assistance', price: 0 },
];

export default function EditServiceModal({ specialist, onClose, onSave }: EditServiceModalProps) {
  const [formData, setFormData] = useState({
    title: specialist.title || '',
    description: specialist.description || '',
    base_price: specialist.base_price || 0,
    duration_days: specialist.duration_days || 1,
    service_category: specialist.service_category || '',
  });
  
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<string[]>(
    specialist.supported_company_types || []
  );
  
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>(
    specialist.serviceOfferings?.map(o => o.title) || []
  );
  
  // Initialize images from specialist.media
  const [images, setImages] = useState<UploadedImage[]>(
    specialist.media?.map(m => ({
      id: m.id,
      url: m.file_name,
      file_name: m.file_name,
    })) || []
  );
  
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Upload image handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG, PNG, GIF, and WebP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    if (images.length >= 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    setUploading(true);

    try {
      let imageUrl: string;

      // If Cloudinary configured properly, upload directly
      if (isCloudinaryConfigured) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', `anycomp/specialists/${specialist.id}`);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        imageUrl = data.secure_url;
      } else {
        // Upload via backend
        const token = localStorage.getItem('token');
        const uploadData = new FormData();
        uploadData.append('image', file);

        const res = await fetch(`${API_URL}/api/media/upload/${specialist.id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        imageUrl = data.data.file_name;
        
        // Add with ID from backend
        setImages([...images, {
          id: data.data.id,
          url: imageUrl,
          file_name: imageUrl,
        }]);
        setUploading(false);
        return;
      }

      // Save URL to backend
      const token = localStorage.getItem('token');
      const saveRes = await fetch(`${API_URL}/api/media/save-url/${specialist.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: imageUrl, mime_type: file.type }),
      });

      if (saveRes.ok) {
        const saveData = await saveRes.json();
        setImages([...images, {
          id: saveData.data.id,
          url: imageUrl,
          file_name: imageUrl,
        }]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Remove image handler
  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];

    if (imageToRemove.id) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/api/media/${imageToRemove.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }

    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert('Title is required');
      return;
    }

    setLoading(true);

    try {
      await onSave({
        ...formData,
        supported_company_types: selectedCompanyTypes,
        serviceOfferings: selectedOfferings.map(title => {
          const offering = AVAILABLE_OFFERINGS.find(o => o.title === title);
          return { 
            title, 
            description: offering?.description,
            price: offering?.price,
            is_selected: true 
          };
        }),
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleOffering = (offering: string) => {
    setSelectedOfferings(prev => 
      prev.includes(offering)
        ? prev.filter(o => o !== offering)
        : [...prev, offering]
    );
  };

  const toggleCompanyType = (typeId: string) => {
    setSelectedCompanyTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-xl h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Edit Service</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-5 flex-1 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter your service title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Describe your service here..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {formData.description.length}/500 words
            </p>
          </div>

          {/* Estimated Completion Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Completion Time (Days)
            </label>
            <select
              value={formData.duration_days}
              onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 14, 21, 30].map((days) => (
                <option key={days} value={days}>{days} {days === 1 ? 'day' : 'days'}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                <span>🇲🇾</span>
                <span className="font-medium text-gray-700">MYR</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.base_price || ''}
                onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                className="w-full pl-20 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Service Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Category
            </label>
            <p className="text-xs text-gray-500 mb-2">Note: Can only choose 1</p>
            <select
              value={formData.service_category}
              onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              <option value="">Select a category</option>
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Supported Company Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supported Company Types
            </label>
            <div className="flex flex-wrap gap-2">
              {COMPANY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleCompanyType(type.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border ${
                    selectedCompanyTypes.includes(type.id)
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedCompanyTypes.includes(type.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedCompanyTypes.includes(type.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Offerings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Offerings
            </label>
            <p className="text-xs text-gray-500 mb-3">Select the add-ons you want to offer</p>
            <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {AVAILABLE_OFFERINGS.map((offering, index) => (
                <div
                  key={index}
                  onClick={() => toggleOffering(offering.title)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
                    selectedOfferings.includes(offering.title)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${
                    selectedOfferings.includes(offering.title)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {selectedOfferings.includes(offering.title) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">{offering.title}</p>
                      {offering.price > 0 && (
                        <span className="text-xs font-medium text-blue-600">+RM {offering.price}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{offering.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Images
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Upload up to 3 images to showcase your service
            </p>
            
            {/* Image Grid - 3 slots */}
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((index) => {
                const image = images[index];
                return (
                  <div key={index} className="relative aspect-square">
                    {image ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={image.url}
                          alt={`Service ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className={`w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                        <span className="text-[10px] text-gray-500 mb-1">
                          Service - Image ({index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'})
                        </span>
                        {uploading && images.length === index ? (
                          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">Upload</span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
