'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Clock, ChevronRight, Home, Search } from 'lucide-react';

interface Specialist {
  id: string;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  final_price: number;
  average_rating: number;
  total_number_of_ratings: number;
  duration_days: number;
  is_verified: boolean;
  service_category?: string;
  media?: { id: string; file_name: string; display_order: number }[];
  user?: { name: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RegisterCompany() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const response = await fetch(`${API_URL}/api/specialists`);
      const data = await response.json();
      
      if (data.success) {
        // Filter for incorporation services
        const incorporationSpecialists = data.data.filter(
          (s: Specialist) => s.service_category === 'Incorporation of a new company'
        );
        setSpecialists(incorporationSpecialists);
      }
    } catch (error) {
      console.error('Failed to fetch specialists:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedSpecialists = [...specialists].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.final_price || a.base_price) - (b.final_price || b.base_price);
      case 'price-high':
        return (b.final_price || b.base_price) - (a.final_price || a.base_price);
      case 'rating':
        return b.average_rating - a.average_rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
              <Home size={14} />
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link href="/services" className="text-gray-500 hover:text-gray-700">
              Services
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium">Register A New Company</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Register a New Company</h1>
          <p className="text-sm sm:text-base text-gray-600">Get Your Company Registered with a Trusted Company Secretary</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]"></div>
          </div>
        ) : sortedSpecialists.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-lg border border-gray-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={20} className="text-gray-400 sm:hidden" />
              <Search size={24} className="text-gray-400 hidden sm:block" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">There are no company registration services available at the moment.</p>
            <p className="text-xs sm:text-sm text-gray-400">Showing all 0 items</p>
          </div>
        ) : (
          <>
            {/* Sort & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-sm text-gray-600">
                Showing {sortedSpecialists.length} service{sortedSpecialists.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#1e3a5f] flex-1 sm:flex-initial"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-4">
              {sortedSpecialists.map((specialist) => (
                <Link
                  key={specialist.id}
                  href={`/services/${specialist.id}`}
                  className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition group"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-64 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                      {specialist.media && specialist.media.length > 0 ? (
                        <img
                          src={specialist.media[0].file_name}
                          alt={specialist.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                          <span className="text-4xl font-bold text-blue-200">
                            {specialist.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#1e3a5f] transition">
                            {specialist.title}
                          </h3>
                          {specialist.user && (
                            <p className="text-sm text-gray-500 mb-2">
                              by {specialist.user.name}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {specialist.description || 'Professional company registration services'}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star size={16} className="text-yellow-500 fill-yellow-500" />
                              <span className="font-medium text-gray-900">
                                {specialist.average_rating > 0 ? specialist.average_rating.toFixed(1) : 'New'}
                              </span>
                              {specialist.total_number_of_ratings > 0 && (
                                <span className="text-gray-500">
                                  ({specialist.total_number_of_ratings})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock size={16} />
                              <span>{specialist.duration_days} day{specialist.duration_days !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-500 mb-1">Starting from</p>
                          <p className="text-xl font-bold text-gray-900">
                            RM {(specialist.final_price || specialist.base_price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination placeholder */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Showing all {sortedSpecialists.length} items
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
