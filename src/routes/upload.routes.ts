import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import { uploadSingleMiddleware, uploadMultipleMiddleware } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * Public Routes (no authentication required)
 */

// Get transformed image
router.get(
  '/:publicId/transform',
  uploadController.getTransformedImage.bind(uploadController)
);

// Get responsive images
router.get(
  '/:publicId/responsive',
  uploadController.getResponsiveImages.bind(uploadController)
);

// Get image information
router.get(
  '/:publicId/info',
  uploadController.getImageInfo.bind(uploadController)
);

/**
 * Authenticated Routes (authentication required)
 */

// Upload single image
router.post(
  '/image',
  authenticate,
  uploadSingleMiddleware,
  uploadController.uploadImage.bind(uploadController)
);

// Upload multiple images
router.post(
  '/images',
  authenticate,
  uploadMultipleMiddleware,
  uploadController.uploadMultipleImages.bind(uploadController)
);

// Upload from URL
router.post(
  '/url',
  authenticate,
  uploadController.uploadFromUrl.bind(uploadController)
);

// Replace image
router.put(
  '/:publicId',
  authenticate,
  uploadSingleMiddleware,
  uploadController.replaceImage.bind(uploadController)
);

// Delete single image
router.delete(
  '/:publicId',
  authenticate,
  uploadController.deleteImage.bind(uploadController)
);

// Batch delete images
router.delete(
  '/',
  authenticate,
  uploadController.batchDeleteImages.bind(uploadController)
);

/**
 * Admin Routes
 */

// List all resources
router.get(
  '/resources',
  authenticate,
  uploadController.listResources.bind(uploadController)
);

// Get storage statistics
router.get(
  '/stats',
  authenticate,
  uploadController.getStorageStats.bind(uploadController)
);

export default router;