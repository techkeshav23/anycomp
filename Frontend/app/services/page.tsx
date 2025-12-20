'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Clock, CheckCircle, Search, Home, ChevronRight } from 'lucide-react';

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
  supported_company_types?: string[];
  media?: { id: string; file_name: string; display_order: number }[];
  user?: { name: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Services() {
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
        setSpecialists(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch specialists:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort specialists
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Register a New Company</h1>
          <p className="text-sm sm:text-base text-gray-600">Get Your Company Registered with a Trusted Company Secretary</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Content */}
        <div className="flex-1">
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
                <p className="text-sm sm:text-base text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <p className="text-xs sm:text-sm text-gray-400">Showing all 0 items</p>
              </div>
            ) : (
              <>
                {/* Sort Bar */}
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

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {sortedSpecialists.map((specialist) => (
                    <Link
                      key={specialist.id}
                      href={`/services/${specialist.id}`}
                      className="bg-white rounded-lg overflow-hidden hover:shadow-md transition group"
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
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
                      <div className="p-4">
                        {/* User Info with Avatar */}
                        <div className="flex items-start gap-2 mb-3">
                          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <span className="text-gray-600 text-sm font-medium">
                              {specialist.user?.name?.charAt(0).toUpperCase() || 'S'}
                            </span>
                          </div>
                          <div className="min-w-0 pt-0.5">
                            <p className="text-sm leading-snug">
                              <span className="font-semibold text-gray-900">{specialist.user?.name || 'Specialist'}</span>
                              <span className="text-gray-500"> - Company Secretary</span>
                            </p>
                          </div>
                        </div>

                        {/* Service Title - Dark gray */}
                        <h3 className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {specialist.title}
                        </h3>

                        {/* Price - Black */}
                        <p className="text-gray-900 font-semibold text-base">
                          RM {specialist.final_price?.toLocaleString() || specialist.base_price?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Bottom count */}
                <div className="mt-6 text-center text-sm text-gray-500">
                  Showing all {sortedSpecialists.length} items
                </div>
              </>
            )}
          </div>
      </div>

      <Footer />
    </div>
  );
}
