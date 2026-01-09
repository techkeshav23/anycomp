'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X, Upload, Loader2, Check, Plus } from 'lucide-react';

interface ServiceOffering {
  title: string;
  description?: string;
  price: number;
  is_selected?: boolean;
}

interface UploadedImage {
  id?: string;
  url: string;
  file_name?: string;
  isNew?: boolean;
}

interface PlatformFeeTier {
  id: string;
  tier_name: string;
  min_value: number;
  max_value: number | null;
  platform_fee_percentage: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

// Check if Cloudinary is properly configured
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

export default function CreateSpecialistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [platformFees, setPlatformFees] = useState<PlatformFeeTier[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    base_price: 0,
    duration_days: 1,
    service_category: '',
  });
  
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<string[]>([]);
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [tempSpecialistId, setTempSpecialistId] = useState<string | null>(null);

  // Fetch platform fees on mount
  useEffect(() => {
    const fetchPlatformFees = async () => {
      try {
        const response = await fetch(`${API_URL}/api/specialists/platform-fees/all`);
        const data = await response.json();
        if (data.success) {
          setPlatformFees(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch platform fees:', error);
      }
    };
    fetchPlatformFees();
  }, []);

  // Calculate platform fee based on tiers
  const calculatePlatformFee = (basePrice: number): { percentage: number; fee: number } => {
    if (platformFees.length === 0) {
      return { percentage: 0, fee: 0 };
    }

    // Find the matching tier
    const tier = platformFees.find(t => {
      const minMatch = basePrice >= t.min_value;
      const maxMatch = t.max_value === null || basePrice <= t.max_value;
      return minMatch && maxMatch;
    });

    if (tier) {
      const percentage = Number(tier.platform_fee_percentage);
      const fee = (basePrice * percentage) / 100;
      return { percentage, fee };
    }

    return { percentage: 0, fee: 0 };
  };

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

      if (isCloudinaryConfigured) {
        // Upload to Cloudinary directly
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        uploadFormData.append('folder', `anycomp/specialists/temp`);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: uploadFormData }
        );

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        imageUrl = data.secure_url;
      } else {
        // Create a local preview URL for now
        imageUrl = URL.createObjectURL(file);
      }

      setImages([...images, {
        url: imageUrl,
        file_name: imageUrl,
        isNew: true,
      }]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Remove image handler
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert('Title is required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Prepare service offerings
      const serviceOfferings = selectedOfferings.map(title => {
        const offering = AVAILABLE_OFFERINGS.find(o => o.title === title);
        return { 
          name: title, 
          description: offering?.description,
          price: offering?.price || 0,
        };
      });

      const response = await fetch(`${API_URL}/api/specialists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          supported_company_types: selectedCompanyTypes,
          serviceOfferings,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const specialistId = data.data.id;

        // Save any uploaded images to the specialist
        if (images.length > 0) {
          for (const image of images) {
            if (image.isNew && image.url) {
              try {
                await fetch(`${API_URL}/api/media/save-url/${specialistId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    url: image.url,
                    mime_type: 'image/jpeg',
                  }),
                });
              } catch (err) {
                console.error('Failed to save image:', err);
              }
            }
          }
        }

        router.push(`/dashboard/specialists/${specialistId}`);
      } else {
        alert(data.message || 'Failed to create specialist');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create specialist');
    } finally {
      setLoading(false);
    }
  };

  // Calculate price display using actual platform fees
  const basePrice = Number(formData.base_price || 0);
  const { percentage: platformFeePercent, fee: platformFee } = calculatePlatformFee(basePrice);
  const totalPrice = basePrice + platformFee;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-500 mb-2">
        Dashboard &gt;{' '}
        <Link href="/dashboard/specialists" className="hover:text-gray-700">
          Specialists
        </Link>{' '}
        &gt; <span className="text-gray-900">Create Specialist</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6">
        <Link
          href="/dashboard/specialists"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Specialist</h1>
      </div>

      {/* Main Content - Two Column Layout */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Form */}
          <div className="flex-1 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Register a new company | Private Limited"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the service here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formData.description.length}/500 words
                </p>
              </div>

              {/* Duration and Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Completion Time
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                  <div className="relative">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                      <span>🇲🇾</span>
                      <span className="font-medium text-gray-700">MYR</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.base_price || ''}
                      onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="w-full pl-20 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Category Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Service Category</h2>
              <p className="text-xs text-gray-500 mb-3">Note: Can only choose 1</p>
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

            {/* Supported Company Types Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Supported Company Types</h2>
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

            {/* Additional Offerings Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Additional Offerings</h2>
              <p className="text-xs text-gray-500 mb-3">Select the add-ons to offer with this service</p>
              <div className="space-y-2 max-h-80 overflow-y-auto">
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

            {/* Service Images Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Service Images</h2>
              <p className="text-xs text-gray-500 mb-3">
                Upload up to 3 images to showcase the service
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
                            Image ({index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'})
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
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Professional Fee Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Professional Fee</h2>
              <p className="text-sm text-gray-500 mb-4">Price breakdown for this service</p>
              
              <div className="text-center py-4 border-b border-gray-200 mb-4">
                <span className="text-3xl font-bold text-gray-900">RM {basePrice.toLocaleString()}</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base price</span>
                  <span className="font-medium">RM {basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 underline decoration-dotted cursor-help" title={`Platform fee: ${platformFeePercent}%`}>
                    Service processing fee ({platformFeePercent}%)
                  </span>
                  <span className="font-medium">RM {platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-600">Total for customer</span>
                  <span className="font-semibold">RM {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Selected Offerings Summary */}
              {selectedOfferings.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Offerings ({selectedOfferings.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedOfferings.slice(0, 3).map((title, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {title.length > 20 ? title.substring(0, 20) + '...' : title}
                      </span>
                    ))}
                    {selectedOfferings.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        +{selectedOfferings.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition"
                >
                  {loading ? 'Creating...' : 'Create Specialist'}
                </button>
                <Link
                  href="/dashboard/specialists"
                  className="block w-full px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
