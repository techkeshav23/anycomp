import { Router } from 'express';
import {
  // Public
  getAllSpecialists,
  getSpecialistById,
  getPlatformFees,
  getMasterServices,
  // Admin - Specialists
  createSpecialist,
  updateSpecialist,
  publishSpecialist,
  unpublishSpecialist,
  deleteSpecialist,
  verifySpecialist,
  // Admin - Master Services
  createMasterService,
  updateMasterService,
  deleteMasterService,
  // Admin - Platform Fees
  savePlatformFee,
} from '../controllers/specialistController';
import { protect, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================
// Browse all approved specialists
router.get('/', optionalAuth, getAllSpecialists);

// Get platform fees
router.get('/platform-fees/all', getPlatformFees);

// Get master services list (predefined services catalog)
router.get('/master-services', getMasterServices);

// Get specialist by ID (public - only approved ones)
router.get('/:id', optionalAuth, getSpecialistById);

// ============================================
// ADMIN ONLY ROUTES
// ============================================
// Create a new specialist
router.post('/', protect, authorize('admin'), createSpecialist);

// Update a specialist
router.put('/:id', protect, authorize('admin'), updateSpecialist);

// Publish a specialist (approve & make public)
router.patch('/:id/publish', protect, authorize('admin'), publishSpecialist);

// Unpublish a specialist (set to draft)
router.patch('/:id/unpublish', protect, authorize('admin'), unpublishSpecialist);

// Verify/Reject a specialist
router.patch('/:id/verify', protect, authorize('admin'), verifySpecialist);

// Delete a specialist (soft delete)
router.delete('/:id', protect, authorize('admin'), deleteSpecialist);

// ============================================
// ADMIN - MASTER SERVICES CRUD
// ============================================
// Create master service
router.post('/master-services', protect, authorize('admin'), createMasterService);

// Update master service
router.put('/master-services/:id', protect, authorize('admin'), updateMasterService);

// Delete master service
router.delete('/master-services/:id', protect, authorize('admin'), deleteMasterService);

// ============================================
// ADMIN - PLATFORM FEES
// ============================================
router.post('/platform-fees', protect, authorize('admin'), savePlatformFee);

export default router;
