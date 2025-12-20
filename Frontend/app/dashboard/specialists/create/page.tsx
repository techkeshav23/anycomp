'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X, Plus } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface ServiceOffering {
  name: string;
  price: number;
}

interface UploadedImage {
  id?: string;
  url: string;
  file_name?: string;
  isNew?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CreateSpecialistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    base_price: 0,
    duration_days: 1,
  });
  const [offerings, setOfferings] = useState<ServiceOffering[]>([]);
  const [newOffering, setNewOffering] = useState({ name: '', price: 0 });
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert('Title is required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          serviceOfferings: offerings,
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

  const addOffering = () => {
    if (newOffering.name && newOffering.price > 0) {
      setOfferings([...offerings, newOffering]);
      setNewOffering({ name: '', price: 0 });
    }
  };

  const removeOffering = (index: number) => {
    setOfferings(offerings.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-500 mb-2">
        Dashboard &gt;{' '}
        <Link href="/dashboard/specialists" className="hover:text-gray-700">
          Services
        </Link>{' '}
        &gt; <span className="text-gray-900">Create Service</span>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Register a new company | Private Limited"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your service here..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {formData.description.length}/500 words
          </p>
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Images
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Upload images that showcase your service. The first image will be used as the primary display image.
          </p>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={5}
            disabled={loading}
          />
        </div>

        {/* Duration and Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Completion Time (Days)
            </label>
            <input
              type="number"
              min="1"
              value={formData.duration_days}
              onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                🇲🇾 MYR
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                className="w-full pl-24 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Offerings */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Offerings
          </label>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              type="text"
              value={newOffering.name}
              onChange={(e) => setNewOffering({ ...newOffering, name: e.target.value })}
              placeholder="Offering name"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={newOffering.price || ''}
                onChange={(e) =>
                  setNewOffering({ ...newOffering, price: parseFloat(e.target.value) || 0 })
                }
                placeholder="Price"
                className="flex-1 sm:w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addOffering}
                className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {offerings.map((offering, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {offering.name} - RM {offering.price}
                <button
                  type="button"
                  onClick={() => removeOffering(index)}
                  className="hover:text-blue-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/dashboard/specialists"
            className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Specialist'}
          </button>
        </div>
      </form>
    </div>
  );
}
