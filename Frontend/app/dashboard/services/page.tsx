'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, Shield } from 'lucide-react';
import EditServiceModal from '@/components/dashboard/EditServiceModal';

interface ServiceOffering {
  id: string;
  title: string;
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

export default function ServicesPage() {
  const router = useRouter();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchMyService();
    } else {
      router.push('/signin');
    }
  }, [router]);

  const fetchMyService = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSpecialist(data.data);
      } else if (response.status === 404) {
        setSpecialist(null);
      }
    } catch (error) {
      console.error('Failed to fetch service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${API_URL}/api/specialists/me`;
      const method = 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowEditModal(false);
        fetchMyService();
      } else {
        alert(data.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service');
    }
  };

  const handlePublish = async () => {
    if (!specialist) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/me/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_draft: false }),
      });

      const data = await response.json();

      if (data.success) {
        fetchMyService();
      } else {
        alert(data.message || 'Failed to publish service');
      }
    } catch (error) {
      console.error('Failed to publish service:', error);
      alert('Failed to publish service');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Empty state for new users
  const emptySpecialist = {
    id: user?.id || '',
    title: '',
    description: '',
    base_price: 0,
    platform_fee: 0,
    final_price: 0,
    duration_days: 1,
    is_draft: true,
    verification_status: 'pending' as const,
    serviceOfferings: [],
    media: [] as { id: string; file_name: string; display_order: number }[],
  };

  const currentSpecialist = specialist || emptySpecialist;
  const basePrice = Number(currentSpecialist.base_price || 0);
  const platformFee = Number(currentSpecialist.platform_fee || 0);
  const totalPrice = basePrice + platformFee;

  return (
    <div className="p-4 sm:p-6">
      {/* Title and Buttons Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            {currentSpecialist.title || 'Register a new company'} | Private Limited - Sdn Bhd
          </h1>
          {/* Status indicator */}
          {!currentSpecialist.is_draft && (
            <p className="text-sm mt-1">
              Status: {' '}
              <span className={`font-medium ${
                currentSpecialist.verification_status === 'approved' ? 'text-green-600' :
                currentSpecialist.verification_status === 'under_review' ? 'text-yellow-600' :
                currentSpecialist.verification_status === 'rejected' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {currentSpecialist.verification_status === 'approved' ? 'Published & Approved' :
                 currentSpecialist.verification_status === 'under_review' ? 'Pending Admin Approval' :
                 currentSpecialist.verification_status === 'rejected' ? 'Rejected by Admin' :
                 'Draft'}
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 border border-blue-900 text-blue-900 rounded-md text-sm font-medium hover:bg-blue-50 transition"
          >
            Edit
          </button>
          {currentSpecialist.is_draft ? (
            <button
              onClick={handlePublish}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition"
            >
              Submit for Approval
            </button>
          ) : currentSpecialist.verification_status === 'under_review' ? (
            <button
              disabled
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 bg-yellow-500 text-white rounded-md text-sm font-medium cursor-not-allowed"
            >
              Awaiting Approval
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              Unpublish
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          {/* Image Gallery */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Main Image */}
            <div className="w-full sm:w-1/2 aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
              {currentSpecialist.media && currentSpecialist.media.length > 0 ? (
                <img
                  src={currentSpecialist.media[0].file_name}
                  alt={currentSpecialist.title || 'Service'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500 text-center px-4">
                    Click Edit to add images for your service
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP up to 5MB</p>
                </div>
              )}
            </div>
            {/* Right Side Images */}
            <div className="w-full sm:w-1/2 grid grid-cols-2 gap-3">
              {currentSpecialist.media && currentSpecialist.media.length > 1 ? (
                currentSpecialist.media.slice(1, 5).map((media, index) => (
                  <div key={media.file_name} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={media.file_name}
                      alt={`Service ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-white text-center">
                        <p className="text-xs opacity-80">COMPANY</p>
                        <p className="text-sm font-bold">10 Best Company Secretarial</p>
                      </div>
                    </div>
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 relative">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-white text-center">
                        <p className="text-xs">Company Secretary Key Role</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-sm text-gray-500">
              {currentSpecialist.description || 'Describe your service here'}
            </p>
          </div>

          {/* Additional Offerings Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Additional Offerings</h2>
            {currentSpecialist.serviceOfferings && currentSpecialist.serviceOfferings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentSpecialist.serviceOfferings.map((offering, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {offering.title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Enhance your service by adding additional offerings</p>
            )}
          </div>

          {/* Company Secretary Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Secretary</h2>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.charAt(0) || 'G'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 uppercase">{user?.name || 'GRACE ONG'}</h3>
                  <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live Online
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-700 font-medium">Certified Company Secretary</span>
                  <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/MIA_logo.svg/1200px-MIA_logo.svg.png" alt="MIA" className="h-5 w-auto" />
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed">
                  Hello, welcome to my Company Secretary Service Store! I'm Grace Ong, a MAICSA Chartered Secretary holder with over 3 years of expertise in Corporate Secretarial Services, Governance & Compliance, and Regulatory Compliance. Together with my dynamic team, we're dedicated to helping both entrepreneurs and established businesses seamlessly incorporate their companies in Malaysia with care, professionalism, and unmatched expertise. This service is your trusted gateway to officially registering your company, ensuring it becomes a recognized legal entity in Malaysia. We're here to guide you every step of the way!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Professional Fee */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Professional Fee</h2>
            <p className="text-sm text-gray-500 mb-4">Set a rate for your service</p>
            
            <div className="text-center py-4 border-b border-gray-200 mb-4">
              <span className="text-3xl font-bold text-gray-900">RM {basePrice.toLocaleString()}</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base price</span>
                <span className="font-medium">RM {basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 underline decoration-dotted cursor-help">Service processing fee</span>
                <span className="font-medium">RM {platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold">RM {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-600">Your returns</span>
                <span className="font-semibold">RM {basePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditServiceModal
          specialist={currentSpecialist}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveService}
        />
      )}
    </div>
  );
}
