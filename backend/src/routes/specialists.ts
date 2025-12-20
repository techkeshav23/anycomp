import { Router } from 'express';
import {
  getAllSpecialists,
  getSpecialistById,
  getMyProfile,
  createMyProfile,
  updateMyProfile,
  addServiceOffering,
  deleteMyServiceOffering,
  submitForReview,
  publishMyProfile,
  publishSpecialist,
  unpublishSpecialist,
  deleteSpecialist,
  deleteServiceOffering,
  verifySpecialist,
  getPlatformFees,
  savePlatformFee,
} from '../controllers/specialistController';
import { protect, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================
// Public users can browse all approved specialists
router.get('/', optionalAuth, getAllSpecialists);
router.get('/platform-fees/all', getPlatformFees);

// ============================================
// SPECIALIST ROUTES (Logged-in specialist - own profile only)
// ============================================
// Get my profile
router.get('/me', protect, authorize('specialist'), getMyProfile);
// Create my profile (first time)
router.post('/me', protect, authorize('specialist'), createMyProfile);
// Update my profile
router.put('/me', protect, authorize('specialist'), updateMyProfile);
// Add service offering to my profile
router.post('/me/services', protect, authorize('specialist'), addServiceOffering);
// Delete my service offering
router.delete('/me/services/:offeringId', protect, authorize('specialist'), deleteMyServiceOffering);
// Submit my profile for review
router.patch('/me/submit', protect, authorize('specialist'), submitForReview);
// Publish/Unpublish my profile
router.patch('/me/publish', protect, authorize('specialist'), publishMyProfile);

// ============================================
// PUBLIC ROUTE - Get specialist by ID (must come after /me routes)
// ============================================
router.get('/:id', optionalAuth, getSpecialistById);

// ============================================
// ADMIN ONLY ROUTES (Full control over all specialists)
// ============================================
// Publish/Approve a specialist
router.patch('/:id/publish', protect, authorize('admin'), publishSpecialist);
// Unpublish a specialist
router.patch('/:id/unpublish', protect, authorize('admin'), unpublishSpecialist);
// Change verification status
router.patch('/:id/verify', protect, authorize('admin'), verifySpecialist);
// Delete a specialist (soft delete)
router.delete('/:id', protect, authorize('admin'), deleteSpecialist);
// Delete a service offering from any specialist
router.delete(
  '/:id/service-offerings/:offeringId',
  protect,
  authorize('admin'),
  deleteServiceOffering
);
// Manage platform fees
router.post('/platform-fees', protect, authorize('admin'), savePlatformFee);

export default router;
