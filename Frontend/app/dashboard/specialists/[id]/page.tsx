'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, ChevronDown } from 'lucide-react';
import EditServiceModal from '@/components/dashboard/EditServiceModal';

interface ServiceOffering {
  id?: string;
  title: string;
  name?: string;
  description?: string;
  price?: number;
  is_selected?: boolean;
}

interface Specialist {
  id: string;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  platform_fee: number;
  final_price: number;
  is_draft: boolean;
  is_verified: boolean;
  verification_status: 'pending' | 'approved' | 'under_review' | 'rejected';
  average_rating: number;
  total_number_of_ratings: number;
  duration_days: number;
  service_category?: string;
  supported_company_types?: string[];
  serviceOfferings?: ServiceOffering[];
  media?: { id: string; file_name: string; display_order: number }[];
  user?: { id: string; name: string; email: string };
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SpecialistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [showOfferings, setShowOfferings] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
    fetchSpecialist();
  }, [params.id]);

  const fetchSpecialist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setSpecialist(data.data);
      } else {
        router.push('/dashboard/specialists');
      }
    } catch (error) {
      console.error('Failed to fetch specialist:', error);
      router.push('/dashboard/specialists');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!specialist) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = specialist.is_draft ? 'publish' : 'unpublish';

      const response = await fetch(`${API_URL}/api/specialists/${specialist.id}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchSpecialist();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/${specialist?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        fetchSpecialist();
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // Use actual values from specialist
  const basePrice = specialist?.base_price || 0;
  const platformFee = specialist?.platform_fee || 0;
  const finalPrice = specialist?.final_price || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!specialist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Specialist not found</p>
        <Link href="/dashboard/specialists" className="text-blue-600 hover:underline mt-2 inline-block">
          Go back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-500 mb-2">
        Dashboard &gt; <Link href="/dashboard/specialists" className="hover:text-gray-700">Services</Link> &gt;{' '}
        <span className="text-gray-900">Service Page</span>
      </div>

      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{specialist.title}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            Edit
          </button>
          {userRole === 'admin' && (
            <button
              onClick={handlePublish}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                !specialist.is_draft
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {specialist.is_draft ? 'Publish' : 'Unpublish'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery - Compact */}
          <div className="flex gap-2 h-[180px]">
            {/* Main Image */}
            <div className="w-1/2 h-full bg-gray-100 rounded-md overflow-hidden">
              {specialist.media && specialist.media.length > 0 ? (
                <img
                  src={specialist.media[0].file_name}
                  alt={specialist.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-[10px] text-gray-500 text-center px-2">Upload image</p>
                  <p className="text-[10px] text-gray-400">PNG, JPG up to 4MB</p>
                </div>
              )}
            </div>
            {/* Secondary Images - 2x2 grid */}
            <div className="w-1/2 h-full grid grid-cols-2 gap-1.5">
              {specialist.media && specialist.media.length > 1 ? (
                specialist.media.slice(1, 5).map((media, index) => (
                  <div key={media.id} className="rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={media.file_name}
                      alt={`Service image ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-blue-800 rounded-md flex items-center justify-center text-white p-2">
                    <p className="text-[10px] font-bold text-center leading-tight">{specialist.title}</p>
                  </div>
                  <div className="bg-gray-200 rounded-md flex items-center justify-center p-2">
                    <p className="text-[10px] text-gray-600 text-center">{specialist.duration_days}d</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-500 text-sm">
              {specialist.description || 'No description provided'}
            </p>
          </div>

          {/* Additional Offerings - Collapsible */}
          <div className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => setShowOfferings(!showOfferings)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-900">Additional Offerings</h2>
                {specialist.serviceOfferings && specialist.serviceOfferings.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {specialist.serviceOfferings.length}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showOfferings ? 'rotate-180' : ''}`} />
            </button>
            {showOfferings && (
              <div className="px-3 pb-3 border-t border-gray-100">
                {specialist.serviceOfferings && specialist.serviceOfferings.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {specialist.serviceOfferings.map((offering, index) => (
                      <span
                        key={offering.id || index}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {offering.title || offering.name}
                        {offering.price && offering.price > 0 ? ` - RM ${offering.price}` : ''}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs italic pt-2">No additional offerings</p>
                )}
              </div>
            )}
          </div>

          {/* Specialist Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Specialist Information</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white font-semibold">
                {specialist.user?.name?.charAt(0).toUpperCase() || specialist.title.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{specialist.user?.name || 'Specialist'}</span>
                  {specialist.is_verified && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Verified</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{specialist.user?.email || ''}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-400">
                    Rating: {specialist.average_rating || 0} ({specialist.total_number_of_ratings || 0} reviews)
                  </span>
                  <span className="text-xs text-gray-400">
                    Duration: {specialist.duration_days} day{specialist.duration_days !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {specialist.description || 'Professional service provider specializing in company secretarial services.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Professional Fee */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Professional Fee</h3>
            <p className="text-sm text-gray-500 mb-4">Set a rate for your service</p>

            <div className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              RM {finalPrice.toLocaleString()}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base price</span>
                <span className="text-gray-900">RM {basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform fee</span>
                <span className="text-gray-900">RM {platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium pt-3 border-t border-gray-200">
                <span className="text-gray-900">Final price</span>
                <span className="text-gray-900">RM {finalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-600">Your returns</span>
                <span className="text-green-600 font-medium">RM {basePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditServiceModal
          specialist={specialist}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
