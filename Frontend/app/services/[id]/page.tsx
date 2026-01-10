'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Star, Clock, CheckCircle, ArrowLeft, Building2, 
  User, Shield, ChevronLeft, ChevronRight, MessageSquare 
} from 'lucide-react';

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
  additional_offerings?: {
    name: string;
    description: string;
    price: number;
  }[];
  media?: { id: string; file_name: string; display_order: number }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SpecialistDetail() {
  const params = useParams();
  const router = useRouter();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchSpecialist(params.id as string);
    }
  }, [params.id]);

  const fetchSpecialist = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/specialists/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setSpecialist(data.data);
      } else {
        router.push('/services');
      }
    } catch (error) {
      console.error('Failed to fetch specialist:', error);
      router.push('/services');
    } finally {
      setLoading(false);
    }
  };

  const toggleAddon = (name: string) => {
    setSelectedAddons(prev => 
      prev.includes(name) 
        ? prev.filter(a => a !== name)
        : [...prev, name]
    );
  };

  const calculateTotal = () => {
    let total = specialist?.final_price || specialist?.base_price || 0;
    
    if (specialist?.additional_offerings) {
      specialist.additional_offerings.forEach(addon => {
        if (selectedAddons.includes(addon.name)) {
          total += addon.price;
        }
      });
    }
    
    return total;
  };

  const nextImage = () => {
    if (specialist?.media) {
      setCurrentImageIndex((prev) => 
        prev === specialist.media!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (specialist?.media) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? specialist.media!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="pt-20 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!specialist) {
    return (
      <div>
        <Navbar />
        <div className="pt-20 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h2>
            <Link href="/services" className="text-blue-600 hover:underline">
              Browse all services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-20 min-h-screen bg-slate-50">
        
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <Link 
              href="/services" 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all services
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Image Gallery */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="aspect-video relative bg-gray-100">
                  {specialist.media && specialist.media.length > 0 ? (
                    <>
                      <img
                        src={specialist.media[currentImageIndex]?.file_name}
                        alt={specialist.title}
                        className="w-full h-full object-cover"
                      />
                      {specialist.media.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {specialist.media.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition ${
                                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                      <span className="text-6xl font-bold text-blue-200">
                        {specialist.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Strip */}
                {specialist.media && specialist.media.length > 1 && (
                  <div className="flex gap-2 p-4 bg-gray-50">
                    {specialist.media.map((media, index) => (
                      <button
                        key={media.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={media.file_name}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {specialist.title}
                    </h1>
                    {specialist.service_category && (
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                        {specialist.service_category}
                      </span>
                    )}
                  </div>
                  {specialist.is_verified && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Rating & Stats */}
                <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-100 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        {specialist.average_rating > 0 ? specialist.average_rating.toFixed(1) : 'New'}
                      </span>
                    </div>
                    {specialist.total_number_of_ratings > 0 && (
                      <span className="text-gray-500">
                        ({specialist.total_number_of_ratings} review{specialist.total_number_of_ratings !== 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{specialist.duration_days} day{specialist.duration_days !== 1 ? 's' : ''} delivery</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About this service</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {specialist.description || 'Professional company secretarial services tailored to your business needs.'}
                  </p>
                </div>

                {/* Supported Company Types */}
                {specialist.supported_company_types && specialist.supported_company_types.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Supported Company Types</h2>
                    <div className="flex flex-wrap gap-2">
                      {specialist.supported_company_types.map((type) => (
                        <div key={type} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Pricing & Order */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
                
                {/* Base Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      RM {(specialist.final_price || specialist.base_price || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Base package price</p>
                </div>

                {/* Additional Offerings */}
                {specialist.additional_offerings && specialist.additional_offerings.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Add-on Services</h3>
                    <div className="space-y-3">
                      {specialist.additional_offerings.map((addon) => (
                        <label 
                          key={addon.name}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                            selectedAddons.includes(addon.name) 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAddons.includes(addon.name)}
                            onChange={() => toggleAddon(addon.name)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900 text-sm">{addon.name}</span>
                              <span className="text-sm font-semibold text-gray-900">
                                +RM {addon.price.toLocaleString()}
                              </span>
                            </div>
                            {addon.description && (
                              <p className="text-xs text-gray-500">{addon.description}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                {selectedAddons.length > 0 && (
                  <div className="mb-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">
                        RM {calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                    Continue to Order
                  </button>
                  <button className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Contact Provider
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Verified Professional</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span>On-time Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
