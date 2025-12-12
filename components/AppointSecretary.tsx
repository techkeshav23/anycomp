'use client';

import { MapPin, Briefcase, Award, FileText, Clock, Building2, MessageCircle, Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SecretaryProfile {
  id: number;
  name: string;
  verified: boolean;
  company: string;
  clients: number;
  location: string;
  experience: string;
  licenseType: string;
  avatar: string;
  coverImage: string;
  coverLabel?: string;
  serviceTitle: string;
  features: string[];
  price: string;
}

const secretaryProfiles: SecretaryProfile[] = [
  {
    id: 1,
    name: "Grace Lam",
    verified: true,
    company: "Corpsec Services Sdn Bhd",
    clients: 250,
    location: "Kuala Lumpur, Malaysia",
    experience: "7+ years as Company Secretary",
    licenseType: "Licensed Company Secretary",
    avatar: "https://i.pravatar.cc/100?img=5",
    coverImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop",
    coverLabel: "Best Company Secretary in Malaysia",
    serviceTitle: "Register your Company with Grace",
    features: [
      "24/7 access to statutory company records",
      "Enjoy one month free Company Secretary Subscription",
      "Complimentary Corporate Bank account opening"
    ],
    price: "RM 1,600"
  },
  {
    id: 2,
    name: "Jessica Lane",
    verified: true,
    company: "Napoli Secretarial Sdn Bhd",
    clients: 371,
    location: "Cyberjaya, Malaysia",
    experience: "4+ years as Company Secretary",
    licenseType: "Licensed Company Secretary",
    avatar: "https://i.pravatar.cc/100?img=9",
    coverImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=250&fit=crop",
    serviceTitle: "Incorporate with Jessica",
    features: [
      "Documents are prioritised for submission and swift processing",
      "Registered office address use",
      "Get automated reminders for all your compliance"
    ],
    price: "RM 1,200"
  },
  {
    id: 3,
    name: "Siti Hisham",
    verified: true,
    company: "Hisham Corps Sdn Bhd",
    clients: 89,
    location: "Petaling Jaya, Selangor",
    experience: "11+ years as Company Secretary",
    licenseType: "Licensed Company Secretary",
    avatar: "https://i.pravatar.cc/100?img=25",
    coverImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=250&fit=crop",
    coverLabel: "Your next Company Secretary",
    serviceTitle: "Hisham will register your Company",
    features: [
      "Receive your first Share certificate at no cost",
      "Always on chat support for Compliance, Filing and General",
      "Have your company documents delivered to you securely"
    ],
    price: "RM 1,200"
  },
  {
    id: 4,
    name: "Ahmad usman",
    verified: true,
    company: "Big Secretarial Sdn Bhd",
    clients: 390,
    location: "Petaling Jaya, Selangor",
    experience: "21+ years as Company Secretary",
    licenseType: "Licensed Company Secretary",
    avatar: "https://i.pravatar.cc/100?img=12",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    serviceTitle: "Incorporate with Jessica",
    features: [
      "Enjoy one month free Company Secretary Subscription",
      "Complimentary Corporate Bank account opening",
      "24/7 access to statutory company records"
    ],
    price: "RM 1,200"
  }
];

export default function AppointSecretary() {
  return (
    <section className="bg-gray-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-navy font-semibold text-sm mb-2">Certified Experts</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">Appoint a Company Secretary</h2>
          <p className="text-slate-500 max-w-2xl text-sm sm:text-base">
            Your secretary handles all details and documents to ensure a smooth and compliant SSM registration.
          </p>
        </div>

        {/* Secretary Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10">
          {secretaryProfiles.map((secretary) => (
            <div key={secretary.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Top Section - Profile Info */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
                {/* Left - Avatar & Company */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden relative flex-shrink-0">
                    <Image
                      src={secretary.avatar}
                      alt={secretary.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{secretary.name}</span>
                      {secretary.verified && (
                        <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle size={10} /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-navy text-xs sm:text-sm font-medium">{secretary.company}</p>
                    <p className="text-slate-400 text-xs">{secretary.clients} clients</p>
                  </div>
                </div>

                {/* Right - Details */}
                <div className="flex-1 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                    <span>{secretary.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Briefcase size={14} className="text-slate-400 flex-shrink-0" />
                    <span>{secretary.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Award size={14} className="text-slate-400 flex-shrink-0" />
                    <span>{secretary.licenseType}</span>
                  </div>
                </div>
              </div>

              {/* Middle Section - Cover Image & Features */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Cover Image */}
                <div className="w-full sm:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={secretary.coverImage}
                    alt={secretary.serviceTitle}
                    fill
                    className="object-cover"
                  />
                  {secretary.coverLabel && (
                    <div className="absolute bottom-2 left-2 bg-navy/90 text-white text-[10px] px-2 py-1 rounded">
                      {secretary.coverLabel}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">{secretary.serviceTitle}</h3>
                  <ul className="space-y-1.5">
                    {secretary.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-navy mt-0.5 flex-shrink-0">
                          {idx === 0 && <FileText size={12} />}
                          {idx === 1 && <Shield size={12} />}
                          {idx === 2 && <Building2 size={12} />}
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-bold text-slate-900 text-lg sm:text-xl mt-3">{secretary.price}</p>
                </div>
              </div>

              {/* Visit Profile Button */}
              <Link 
                href={`/secretary/${secretary.id}`}
                className="block w-full bg-navy text-white text-center py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-sm sm:text-base"
              >
                Visit Profile
              </Link>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Link 
            href="/appoint-secretary" 
            className="inline-block bg-navy text-white px-6 sm:px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors text-sm sm:text-base"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
