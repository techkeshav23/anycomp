import { Request } from 'express';

// User roles - only admin (from .env, no DB table)
export type UserRole = 'admin';

// Verification status
export type VerificationStatus = 'pending' | 'approved' | 'under_review' | 'rejected';

// Platform fee tiers
export type TierName = 'basic' | 'standard' | 'premium' | 'enterprise';

// Media types
export type MediaType = 'image' | 'video' | 'document' | 'thumbnail';
export type MimeType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'application/pdf' | 'video/mp4';

// Admin user (from .env - no DB table)
export interface IAdmin {
  email: string;
  name: string;
  role: UserRole;
}

// Specialist interface (Service Listing - managed by Admin)
export interface ISpecialist {
  id: string; // Auto-generated UUID
  // Service info (same as boss's schema)
  title: string;
  slug: string | null;
  description: string | null;
  // Pricing
  base_price: number;
  platform_fee: number;
  final_price: number;
  // Ratings
  average_rating: number;
  total_number_of_ratings: number;
  // Status
  is_draft: boolean;
  verification_status: VerificationStatus;
  is_verified: boolean;
  duration_days: number;
  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  // Relations
  media?: IMedia[];
  serviceOfferings?: IServiceOffering[];
}

// Service Offerings Master List (Predefined services catalog)
export interface IServiceOfferingsMasterList {
  id: string;
  title: string;
  description: string | null;
  s3_key: string | null;
  bucket_name: string | null;
  created_at: Date;
  updated_at: Date;
}

// Service offering interface (Junction table - links specialists to master services)
export interface IServiceOffering {
  id: string;
  specialists: string; // FK to specialists
  service_offerings_master_list_id: string; // FK to master list
  created_at: Date;
  updated_at: Date;
  specialist?: ISpecialist;
  masterService?: IServiceOfferingsMasterList;
}

// Platform fee interface
export interface IPlatformFee {
  id: string;
  tier_name: TierName;
  min_value: number;
  max_value: number | null;
  platform_fee_percentage: number;
  created_at: Date;
  updated_at: Date;
}

// Media interface
export interface IMedia {
  id: string;
  specialists: string;
  file_name: string;
  file_size: number | null;
  display_order: number;
  mime_type: MimeType | null;
  media_type: MediaType;
  uploaded_at: Date | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  specialist?: ISpecialist;
}

// JWT payload interface (email-based, no user id)
export interface JwtPayload {
  email: string;
  role: UserRole;
}

// Extended Request interface with admin
export interface AuthRequest extends Request {
  user?: IAdmin;
}

// API Response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  stack?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Price calculation result
export interface PriceCalculation {
  platform_fee: number;
  final_price: number;
}

// Admin login request
export interface AdminLoginRequest {
  email: string;
  password: string;
}
