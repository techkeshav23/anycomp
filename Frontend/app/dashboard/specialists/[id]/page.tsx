'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, Loader2, User, Check } from 'lucide-react';
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
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const COMPANY_TYPE_LABELS: { [key: string]: string } = {
  'sdn_bhd': 'Private Limited - Sdn Bhd',
  'bhd': 'Public Limited - Bhd.',
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function SpecialistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Validate UUID before fetching
    const id = params.id as string;
    if (!id || !UUID_REGEX.test(id)) {
      setLoading(false);
      return;
    }
    fetchSpecialist();
  }, [params.id]);

  const fetchSpecialist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
    if (!specialist || publishing) return;
    setPublishing(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = specialist.is_draft ? 'publish' : 'unpublish';
      const response = await fetch(`${API_URL}/api/specialists/${specialist.id}/${endpoint}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSpecialist(prev => prev ? { ...prev, is_draft: data.data.is_draft, verification_status: data.data.verification_status } : null);
        setShowPublishModal(false);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Publish error:', error);
    } finally {
      setPublishing(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/${specialist?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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

  const basePrice = specialist?.base_price || 1800;
  const platformFee = specialist?.platform_fee || 540;
  const finalPrice = specialist?.final_price || 2340;

  const getCompanyTypeLabel = () => {
    if (specialist?.supported_company_types && specialist.supported_company_types.length > 0) {
      return COMPANY_TYPE_LABELS[specialist.supported_company_types[0]] || specialist.supported_company_types[0];
    }
    return 'Private Limited - Sdn Bhd';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!specialist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Service not found</p>
        <Link href="/dashboard/specialists" className="text-blue-600 hover:underline mt-2 inline-block">Go back</Link>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Main Layout */}
      <div className="flex gap-14">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-xl font-semibold text-gray-900 pb-2">
            {specialist.title} | {getCompanyTypeLabel()}
          </h1>
          
          {/* Image Gallery - Exact Figma Layout */}
          <div className="flex gap-3" style={{ height: '320px' }}>
            {/* Left - Main Upload Area */}
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white">
              {specialist.media && specialist.media.length > 0 ? (
                <img src={specialist.media[0].file_name} alt={specialist.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 text-center px-4">
                    Upload an image for your service listing in PNG, JPG or JPEG,
                  </p>
                  <p className="text-xs text-gray-400">up to 4MB</p>
                </>
              )}
            </div>

            {/* Right - Two Cards Stack */}
            <div className="w-[350px] flex flex-col gap-3">
              {/* Top Card */}
              <div className="flex-1 rounded-lg overflow-hidden">
                <img 
                  src={specialist.media && specialist.media[1] ? specialist.media[1].file_name : "/1.png"} 
                  alt="Preview 1" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Bottom Card */}
              <div className="flex-1 rounded-lg overflow-hidden">
                <img 
                  src={specialist.media && specialist.media[2] ? specialist.media[2].file_name : "/2.png"} 
                  alt="Preview 2" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Description</h2>
            <p className="text-sm text-gray-400">
              {specialist.description || 'Describe your service here'}
            </p>
          </div>

          {/* Additional Offerings */}
          <div>
            <h2 className="text-base font-semibold border-t border-gray-200 text-gray-900 mb-1 pt-4">Additional Offerings</h2>
            <p className="text-sm text-gray-400">
              {specialist.serviceOfferings && specialist.serviceOfferings.length > 0 
                ? specialist.serviceOfferings.map(o => o.title || o.name).join(', ')
                : 'Enhance your service by adding additional offerings'
              }
            </p>
          </div>

          {/* Company Secretary */}
          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Company Secretary</h2>
            
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <User className="w-7 h-7 text-amber-700" />
              </div>
              
              {/* Info */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">Grace Lee</span>
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <Check className="w-3 h-3" />
                    <span className="text-[10px] font-medium">Verified</span>
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mb-3">Company Secretary, Sdn Bhd</p>
                <button className="px-3 py-1.5 bg-[#0f172a] text-white text-[10px] font-medium rounded hover:bg-[#1e293b] transition-colors">
                  View Profile
                </button>
              </div>

              {/* Certifications */}
              <div className="ml-auto">
                <p className="text-[10px] text-gray-900 font-medium mb-2">Certified Company Secretary</p>
                <div className="flex items-center gap-2">
                  <div className="h-14 w-24 flex items-center justify-center">
                    <img src="/3.png" alt="MAICSA" className="h-full w-full object-contain" />
                  </div>
                  <div className="h-14 w-24 flex items-center justify-center">
                    <img src="/4.png" alt="SSM" className="h-full w-full object-contain" />
                  </div>
                  <div className="h-14 w-24 flex items-center justify-center">
                    <img src="/5.png" alt="LS" className="h-full w-full object-contain" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-3 text-[10px] text-gray-500 leading-3 text-left max-w-[50%]">
              A company secretarial service may just be basic, why bother with choosing? But every
              company deserves a professional and firm in their compliance and to help
              it save fees ever — attention to detail, committed to deadlines, and focused on
              growth. With over 3+ years of practice in corporate & company secretary with professional
              legal background, I aim to assist your company&apos;s governance smoothly, swiftly and professionally.
              CSec is here to make your corporate governance smooth, secure and stress-free.
              Your Company&apos;s peace of mind starts here.
            </p>
          </div>
        </div>

        {/* Right Sidebar - Professional Fee */}
        <div className="w-[400px] flex-shrink-0">
          <div className="flex gap-2 mb-4 justify-start">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-24 py-2 bg-[#0f172a] text-white text-xs font-medium hover:bg-[#1e293b] transition-colors rounded"
            >
              Edit
            </button>
            <button
              onClick={() => setShowPublishModal(true)}
              className={`w-24 py-2 text-white text-xs font-medium transition-colors rounded ${specialist.is_draft ? 'bg-[#1e3a5f] hover:bg-[#2e5080]' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {specialist.is_draft ? 'Publish' : 'Unpublish'}
            </button>
          </div>
          <div className="bg-white border border-gray-200 p-6 shadow-xl h-fit">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Professional Fee
            </h3>
            <p className="text-sm text-gray-500 mb-8">Set a rate for your service</p>

            <div className="flex justify-center mb-10">
              <div className="text-3xl font-medium text-gray-900 border-b-2 border-black pb-1">
                RM {basePrice.toLocaleString()}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-600">Base price</span>
                <span className="font-bold text-gray-900">RM {basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-500 underline decoration-gray-400 underline-offset-2">Service processing fee</span>
                <span className="font-bold text-gray-900">RM {platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Total</span>
                <span className="font-bold text-gray-900">RM {finalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-6 border-t border-black mt-2 text-sm">
                <span className="font-medium text-gray-600">Your returns</span>
                <span className="font-bold text-gray-900">RM {basePrice.toLocaleString()}</span>
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

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="flex gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg font-semibold">!</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {specialist.is_draft ? 'Publish changes' : 'Unpublish service'}
                </h3>
                <p className="text-sm text-gray-500">
                  {specialist.is_draft 
                    ? 'Do you want to publish these changes? It will appear in the marketplace listing'
                    : 'Do you want to unpublish this service? It will be removed from the marketplace listing'
                  }
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                disabled={publishing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Continue Editing
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1e3a5f] rounded-lg hover:bg-[#162d4d] flex items-center gap-2"
              >
                {publishing ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
