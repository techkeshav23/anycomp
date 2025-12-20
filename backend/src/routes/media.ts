import { Router } from 'express';
import multer from 'multer';
import {
  uploadMedia,
  uploadMultipleMedia,
  getSpecialistMedia,
  deleteMedia,
  reorderMedia,
  saveMediaUrl,
} from '../controllers/mediaController';
import { protect } from '../middleware/auth';

const router = Router();

// Configure multer for memory storage (files stored in buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10, // Max 10 files at once
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

// Public routes
router.get('/:specialistId', getSpecialistMedia);

// Protected routes (require authentication)
router.post(
  '/upload/:specialistId',
  protect,
  upload.single('image'),
  uploadMedia
);

router.post(
  '/upload-multiple/:specialistId',
  protect,
  upload.array('images', 10),
  uploadMultipleMedia
);

router.post(
  '/save-url/:specialistId',
  protect,
  saveMediaUrl
);

router.patch(
  '/reorder/:specialistId',
  protect,
  reorderMedia
);

router.delete(
  '/:mediaId',
  protect,
  deleteMedia
);

export default router;
