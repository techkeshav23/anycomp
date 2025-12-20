'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Plus,
  Download,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';

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
  created_at: string;
  updated_at: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [userRole, setUserRole] = useState<string>('user');

  const handleActionClick = (e: React.MouseEvent, specialistId: string) => {
    e.stopPropagation();
    if (actionMenuId === specialistId) {
      setActionMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.left - 80,
      });
      setActionMenuId(specialistId);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  useEffect(() => {
    fetchSpecialists();
  }, [activeTab, searchQuery, currentPage]);

  const fetchSpecialists = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/specialists?page=${currentPage}&limit=10`;

      if (activeTab === 'Drafts') {
        url += '&is_draft=true';
      } else if (activeTab === 'Published') {
        url += '&is_draft=false';
      }

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setSpecialists(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch specialists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this specialist?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchSpecialists();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
    setActionMenuId(null);
  };

  const handlePublish = async (id: string, isDraft: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isDraft ? 'publish' : 'unpublish';
      
      const response = await fetch(`${API_URL}/api/specialists/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchSpecialists();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/${id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verification_status: 'approved' }),
      });

      if (response.ok) {
        fetchSpecialists();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve');
      }
    } catch (error) {
      console.error('Approve error:', error);
    }
    setActionMenuId(null);
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/specialists/${id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verification_status: 'rejected' }),
      });

      if (response.ok) {
        fetchSpecialists();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reject');
      }
    } catch (error) {
      console.error('Reject error:', error);
    }
    setActionMenuId(null);
  };

  const getVerificationStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: 'bg-green-50 text-green-600 border border-green-200',
      under_review: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      rejected: 'bg-red-50 text-red-600 border border-red-200',
      pending: 'bg-gray-50 text-gray-600 border border-gray-200',
    };
    return styles[status] || styles.pending;
  };

  const formatVerificationStatus = (status: string) => {
    const labels: Record<string, string> = {
      approved: 'Approved',
      under_review: 'Under-Review',
      rejected: 'Rejected',
      pending: 'Pending',
    };
    return labels[status] || 'Pending';
  };

  const getDraftStatusBadge = (isDraft: boolean) => {
    return isDraft
      ? 'bg-red-600 text-white'
      : 'bg-green-500 text-white';
  };

  const formatPrice = (price: number) => {
    return `RM ${price.toLocaleString()}`;
  };

  const formatDuration = (days: number) => {
    if (!days) return '1 Day';
    return days === 1 ? '1 Day' : `${days} Days`;
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        Dashboard &gt; <span className="text-gray-900">Services</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Specialists</h1>
        <p className="text-gray-500 text-sm">
          Create and publish your services for Client's & Companies
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          {['All', 'Drafts', 'Published'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-gray-900 border-b-2 border-blue-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Services"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/specialists/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-visible">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchases
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publish Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  </div>
                </td>
              </tr>
            ) : specialists.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No specialists found. Create your first one!
                </td>
              </tr>
            ) : (
              specialists.map((specialist) => (
                <tr key={specialist.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/dashboard/specialists/${specialist.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {specialist.title}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatPrice(specialist.final_price)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {specialist.total_number_of_ratings}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatDuration(specialist.duration_days)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getVerificationStatusBadge(
                        specialist.verification_status
                      )}`}
                    >
                      {formatVerificationStatus(specialist.verification_status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-4 py-1.5 rounded-full text-xs font-medium ${getDraftStatusBadge(
                        specialist.is_draft
                      )}`}
                    >
                      {specialist.is_draft ? 'Not Published' : 'Published'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => handleActionClick(e, specialist.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Action Menu Portal */}
        {actionMenuId && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setActionMenuId(null)}
            />
            <div 
              className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              <Link
                href={`/dashboard/specialists/${actionMenuId}/edit`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setActionMenuId(null)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              {userRole === 'admin' && (() => {
                const selectedSpecialist = specialists.find(s => s.id === actionMenuId);
                const isUnderReview = selectedSpecialist?.verification_status === 'under_review';
                return (
                  <>
                    {isUnderReview && (
                      <>
                        <button
                          onClick={() => handleApprove(actionMenuId)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(actionMenuId)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(actionMenuId)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                );
              })()}
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              {pagination.totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(pagination.totalPages)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      currentPage === pagination.totalPages
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
