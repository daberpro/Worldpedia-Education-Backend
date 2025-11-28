import { Request, Response } from 'express';
import uploadService from '../services/upload.service';
import imageService from '../services/image.service';
import { logger } from '../utils/logger';

export class UploadController {
  /**
   * Upload single image
   */
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const userId = (req.user as any)?.userId;

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file provided'
        });
        return;
      }

      const result = await uploadService.uploadImage(file, userId);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Image uploaded successfully'
      });
    } catch (error: any) {
      logger.error('Error uploading image:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload image'
      });
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const userId = (req.user as any)?.userId;

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No files provided'
        });
        return;
      }

      const result = await uploadService.uploadMultipleImages(files, userId);

      res.status(201).json({
        success: true,
        data: result,
        message: `${result.successCount} images uploaded successfully`
      });
    } catch (error: any) {
      logger.error('Error uploading images:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload images'
      });
    }
  }

  /**
   * Upload image from URL
   */
  async uploadFromUrl(req: Request, res: Response): Promise<void> {
    try {
      const { imageUrl } = req.body;
      const userId = (req.user as any)?.userId;

      if (!imageUrl) {
        res.status(400).json({
          success: false,
          error: 'Image URL is required'
        });
        return;
      }

      const result = await uploadService.uploadFromUrl(imageUrl, userId);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Image uploaded successfully from URL'
      });
    } catch (error: any) {
      logger.error('Error uploading from URL:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload from URL'
      });
    }
  }

  /**
   * Replace existing image
   */
  async replaceImage(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.params;
      const file = req.file;
      const userId = (req.user as any)?.userId;

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file provided'
        });
        return;
      }

      const result = await uploadService.replaceImage(publicId, file, userId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Image replaced successfully'
      });
    } catch (error: any) {
      logger.error('Error replacing image:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to replace image'
      });
    }
  }

  /**
   * Delete image
   */
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.params;

      await uploadService.deleteImage(publicId);

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error: any) {
      logger.error('Error deleting image:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete image'
      });
    }
  }

  /**
   * Batch delete images
   */
  async batchDeleteImages(req: Request, res: Response): Promise<void> {
    try {
      const { publicIds } = req.body;

      if (!publicIds || !Array.isArray(publicIds)) {
        res.status(400).json({
          success: false,
          error: 'publicIds array is required'
        });
        return;
      }

      const result = await uploadService.deleteMultipleImages({ publicIds });

      res.status(200).json({
        success: true,
        data: result,
        message: `${result.deletedCount} images deleted successfully`
      });
    } catch (error: any) {
      logger.error('Error deleting images:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete images'
      });
    }
  }

  /**
   * List uploaded resources
   */
  async listResources(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 100, type = 'all' } = req.query;

      const resources = await uploadService.listResources(
        parseInt(limit as string),
        type as string
      );

      res.status(200).json({
        success: true,
        data: resources,
        count: resources.length,
        message: 'Resources retrieved successfully'
      });
    } catch (error: any) {
      logger.error('Error listing resources:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to list resources'
      });
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await uploadService.getStorageStats();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Storage statistics retrieved successfully'
      });
    } catch (error: any) {
      logger.error('Error getting storage stats:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get storage statistics'
      });
    }
  }

  /**
   * Get image information
   */
  async getImageInfo(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.params;

      const info = await uploadService.getImageInfo(publicId);

      res.status(200).json({
        success: true,
        data: info,
        message: 'Image information retrieved successfully'
      });
    } catch (error: any) {
      logger.error('Error getting image info:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get image information'
      });
    }
  }

  /**
   * Get responsive images
   */
  async getResponsiveImages(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.params;

      const images = imageService.getResponsiveImages(publicId);

      res.status(200).json({
        success: true,
        data: images,
        message: 'Responsive images retrieved successfully'
      });
    } catch (error: any) {
      logger.error('Error getting responsive images:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get responsive images'
      });
    }
  }

  /**
   * Get transformed image
   */
  async getTransformedImage(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.params;
      const { width, height, quality, crop, format, gravity } = req.query;

      const url = imageService.getTransformedImage(publicId, {
        width: width ? parseInt(width as string) : undefined,
        height: height ? parseInt(height as string) : undefined,
        quality: quality ? parseInt(quality as string) : undefined,
        crop: crop as string,
        format: format as string,
        gravity: gravity as string
      });

      res.status(200).json({
        success: true,
        data: { url },
        message: 'Transformed image URL retrieved successfully'
      });
    } catch (error: any) {
      logger.error('Error getting transformed image:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get transformed image'
      });
    }
  }
}

export default new UploadController();