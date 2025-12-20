import { Request } from 'express';

// User roles - specialist is a service provider
export type UserRole = 'specialist' | 'admin';

// Verification status
export type VerificationStatus = 'pending' | 'approved' | 'under_review' | 'rejected';

// Platform fee tiers
export type TierName = 'basic' | 'standard' | 'premium' | 'enterprise';

// Media types
export type MediaType = 'image' | 'video' | 'document' | 'thumbnail';
export type MimeType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'application/pdf' | 'video/mp4';

// User interface (Authentication)
export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  // 1:1 relation with specialist
  specialist?: ISpecialist;
}

// Specialist interface (Service Provider Profile - 1:1 with User, shared PK)
export interface ISpecialist {
  id: string; // Same as users.id (shared primary key)
  // Service info (same as original schema)
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
  user?: IUser;
  media?: IMedia[];
  serviceOfferings?: IServiceOffering[];
}

// Service offering interface (Additional offerings - same as original schema)
export interface IServiceOffering {
  id: string;
  specialists: string;
  created_at: Date;
  updated_at: Date;
  specialist?: ISpecialist;
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

// JWT payload interface
export interface JwtPayload {
  id: string;
  role: UserRole;
}

// Extended Request interface with user
export interface AuthRequest extends Request {
  user?: IUser;
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

// Signup request for specialist
export interface SpecialistSignupRequest {
  // User fields
  name: string;
  email: string;
  password: string;
  phone?: string;
  // Specialist fields (optional - can be added later)
  title?: string;
  description?: string;
  base_price?: number;
  duration_days?: number;
}
