'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
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
  media?: { id: string; file_name: string; media_type?: string; display_order?: number }[];
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
      const response = await fetch(`${API_URL}/api/specialists/${params.id}`);
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
          {/* Image Upload Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Upload an image for your service listing in PNG, JPG or JPEG</p>
              <p className="text-xs text-gray-400">up to 4MB</p>
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="bg-blue-800 rounded-lg flex items-center justify-center text-white p-4">
                <div className="text-center">
                  <div className="text-xl font-bold">10 Best Company</div>
                  <div className="text-lg">Secretarial in</div>
                  <div className="text-lg">Johor Bahru</div>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg flex items-center justify-center p-4">
                <div className="text-center text-gray-700 text-sm">
                  <p className="font-semibold">A Company Secretary</p>
                  <p>Represents a Key Role</p>
                  <p>in Any Business.</p>
                  <p>This is Why</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-500 text-sm">
              {specialist.description || 'Describe your service here'}
            </p>
          </div>

          {/* Additional Offerings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Additional Offerings</h2>
            <p className="text-gray-500 text-sm mb-4">
              Enhance your service by adding additional offerings
            </p>
            {specialist.serviceOfferings && specialist.serviceOfferings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {specialist.serviceOfferings.map((offering, index) => (
                  <span
                    key={offering.id || index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {offering.title || offering.name} - RM {offering.price}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No additional offerings added</p>
            )}
          </div>

          {/* Company Secretary */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Secretary</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white font-semibold">
                GL
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Grace Lam</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Verified</span>
                </div>
                <p className="text-sm text-gray-500">Corpse Services Sdn Bhd</p>
                <p className="text-xs text-gray-400">350 Clients • 4.5</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  A company secretarial service founded by Grace, who believes that every
                  company deserves clarity, confidence, and care in their compliance journey.
                  Inspired by the spirit of entrepreneurship, Asta treats every client's business as if
                  it were her own – attentive to detail, committed to deadlines, and focused on
                  building trust with every document filed.
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
