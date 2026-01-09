import { Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Media, Specialist } from '../entity';
import { AuthRequest, IMedia, ISpecialist } from '../types';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

// Get repositories
const getMediaRepository = () => AppDataSource.getRepository(Media);
const getSpecialistRepository = () => AppDataSource.getRepository(Specialist);

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ secure_url: string; public_id: string; bytes: number; format: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `anycomp/${folder}`,
        public_id: publicId,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
          { quality: 'auto:good' }, // Auto quality optimization
          { fetch_format: 'auto' }, // Auto format (webp where supported)
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            bytes: result.bytes,
            format: result.format,
          });
        }
      }
    );

    // Create readable stream from buffer and pipe to upload stream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// Helper: Delete from Cloudinary
const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
  }
};

// Helper: Extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/public_id.ext
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
};

// @desc    Upload media for a specialist
// @route   POST /api/media/upload/:specialistId
// @access  Private (Specialist owner or Admin)
export const uploadMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { specialistId } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file provided',
      });
      return;
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
      });
      return;
    }

    // Check if specialist exists and user has permission
    const specialistRepository = getSpecialistRepository();
    const specialist = await specialistRepository.findOne({
      where: { id: specialistId },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    // Check permission: must be owner or admin
    if (req.user?.role !== 'admin' && req.user?.id !== specialist.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to upload media for this specialist',
      });
      return;
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      `specialists/${specialistId}`,
      `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, '')}`
    );

    // Get current media count for display_order
    const mediaRepository = getMediaRepository();
    const mediaCount = await mediaRepository.count({
      where: { specialists: specialistId },
    });

    // Determine mime type
    const mimeType = file.mimetype as IMedia['mime_type'];

    // Save media record to database
    const media = mediaRepository.create({
      specialists: specialistId,
      file_name: uploadResult.secure_url, // Store Cloudinary URL
      file_size: uploadResult.bytes,
      mime_type: mimeType,
      media_type: 'image',
      display_order: mediaCount,
      uploaded_at: new Date(),
    });

    await mediaRepository.save(media);

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple media files for a specialist
// @route   POST /api/media/upload-multiple/:specialistId
// @access  Private (Specialist owner or Admin)
export const uploadMultipleMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { specialistId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files provided',
      });
      return;
    }

    // Check if specialist exists and user has permission
    const specialistRepository = getSpecialistRepository();
    const specialist = await specialistRepository.findOne({
      where: { id: specialistId },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    // Check permission: must be owner or admin
    if (req.user?.role !== 'admin' && req.user?.id !== specialist.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to upload media for this specialist',
      });
      return;
    }

    const mediaRepository = getMediaRepository();
    let currentOrder = await mediaRepository.count({
      where: { specialists: specialistId },
    });

    const uploadedMedia: IMedia[] = [];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    for (const file of files) {
      // Skip invalid file types
      if (!allowedMimeTypes.includes(file.mimetype)) {
        continue;
      }

      try {
        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(
          file.buffer,
          `specialists/${specialistId}`,
          `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, '')}`
        );

        const mimeType = file.mimetype as IMedia['mime_type'];

        // Save media record
        const media = mediaRepository.create({
          specialists: specialistId,
          file_name: uploadResult.secure_url,
          file_size: uploadResult.bytes,
          mime_type: mimeType,
          media_type: 'image',
          display_order: currentOrder++,
          uploaded_at: new Date(),
        });

        await mediaRepository.save(media);
        uploadedMedia.push(media as IMedia);
      } catch (uploadError) {
        console.error(`Failed to upload ${file.originalname}:`, uploadError);
      }
    }

    res.status(201).json({
      success: true,
      message: `${uploadedMedia.length} files uploaded successfully`,
      data: uploadedMedia,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all media for a specialist
// @route   GET /api/media/:specialistId
// @access  Public
export const getSpecialistMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { specialistId } = req.params;

    const mediaRepository = getMediaRepository();
    const media = await mediaRepository.find({
      where: { specialists: specialistId },
      order: { display_order: 'ASC' },
    });

    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:mediaId
// @access  Private (Specialist owner or Admin)
export const deleteMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { mediaId } = req.params;

    const mediaRepository = getMediaRepository();
    const media = await mediaRepository.findOne({
      where: { id: mediaId },
    }) as IMedia | null;

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Media not found',
      });
      return;
    }

    // Check permission: must be owner or admin
    if (req.user?.role !== 'admin' && req.user?.id !== media.specialists) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this media',
      });
      return;
    }

    // Delete from Cloudinary
    const publicId = getPublicIdFromUrl(media.file_name);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    // Delete from database
    await mediaRepository.remove(media as any);

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update media display order
// @route   PATCH /api/media/reorder/:specialistId
// @access  Private (Specialist owner or Admin)
export const reorderMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { specialistId } = req.params;
    const { mediaOrder } = req.body as { mediaOrder: { id: string; order: number }[] };

    if (!mediaOrder || !Array.isArray(mediaOrder)) {
      res.status(400).json({
        success: false,
        message: 'mediaOrder array is required',
      });
      return;
    }

    // Check if specialist exists and user has permission
    const specialistRepository = getSpecialistRepository();
    const specialist = await specialistRepository.findOne({
      where: { id: specialistId },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    if (req.user?.role !== 'admin' && req.user?.id !== specialist.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to reorder media for this specialist',
      });
      return;
    }

    const mediaRepository = getMediaRepository();

    // Update each media's display_order
    for (const item of mediaOrder) {
      await mediaRepository.update(
        { id: item.id, specialists: specialistId },
        { display_order: item.order }
      );
    }

    // Fetch updated media
    const updatedMedia = await mediaRepository.find({
      where: { specialists: specialistId },
      order: { display_order: 'ASC' },
    });

    res.json({
      success: true,
      message: 'Media order updated successfully',
      data: updatedMedia,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload via URL (for frontend direct Cloudinary uploads)
// @route   POST /api/media/save-url/:specialistId
// @access  Private (Specialist owner or Admin)
export const saveMediaUrl = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { specialistId } = req.params;
    const { url, file_size, mime_type } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        message: 'URL is required',
      });
      return;
    }

    // Validate URL - reject blob URLs as they are temporary browser URLs
    if (url.startsWith('blob:')) {
      res.status(400).json({
        success: false,
        message: 'Invalid URL: blob URLs are not allowed. Please upload the image file directly.',
      });
      return;
    }

    // Validate that it's a proper HTTP/HTTPS URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      res.status(400).json({
        success: false,
        message: 'Invalid URL: Only HTTP/HTTPS URLs are allowed.',
      });
      return;
    }

    // Check if specialist exists and user has permission
    const specialistRepository = getSpecialistRepository();
    const specialist = await specialistRepository.findOne({
      where: { id: specialistId },
    }) as ISpecialist | null;

    if (!specialist) {
      res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
      return;
    }

    if (req.user?.role !== 'admin' && req.user?.id !== specialist.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to add media for this specialist',
      });
      return;
    }

    const mediaRepository = getMediaRepository();
    const mediaCount = await mediaRepository.count({
      where: { specialists: specialistId },
    });

    // Save media record
    const media = mediaRepository.create({
      specialists: specialistId,
      file_name: url,
      file_size: file_size || null,
      mime_type: mime_type || 'image/jpeg',
      media_type: 'image',
      display_order: mediaCount,
      uploaded_at: new Date(),
    });

    await mediaRepository.save(media);

    res.status(201).json({
      success: true,
      message: 'Media saved successfully',
      data: media,
    });
  } catch (error) {
    next(error);
  }
};
