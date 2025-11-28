import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { logger } from '../utils/logger';
import {
  UploadResult,
  BulkUploadResult,
  StorageStats,
  DeleteResult,
  DeleteOptions,
  CloudinaryResource
} from '../types/upload.types';
import { validateUploadFile, generatePublicId } from '../utils/image-validator';

export class UploadService {
  /**
   * Upload single image to Cloudinary
   */
  async uploadImage(
    file: Express.Multer.File,
    userId?: string,
    options: Record<string, any> = {}
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = validateUploadFile(file);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Generate public ID
      const publicId = generatePublicId(userId || 'anonymous', 'images', file.originalname);

      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: 'auto',
            folder: 'worldpedia',
            quality: 'auto',
            fetch_format: 'auto',
            overwrite: true,
            ...options
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        );

        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(stream);
      });

      logger.info(`✅ Image uploaded: ${result.public_id}`);

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        uploadedAt: result.created_at,
        resourceType: result.resource_type
      };
    } catch (error) {
      logger.error('Failed to upload image:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: Express.Multer.File[],
    userId?: string
  ): Promise<BulkUploadResult> {
    const successful: UploadResult[] = [];
    const failed: Array<{ filename: string; error: string }> = [];

    for (const file of files) {
      try {
        const result = await this.uploadImage(file, userId);
        successful.push(result);
      } catch (error: any) {
        failed.push({
          filename: file.originalname,
          error: error.message
        });
        logger.error(`Failed to upload ${file.originalname}:`, error);
      }
    }

    return {
      successful,
      failed,
      total: files.length,
      successCount: successful.length,
      failureCount: failed.length
    };
  }

  /**
   * Upload image from URL
   */
  async uploadFromUrl(
    imageUrl: string,
    userId?: string,
    options: Record<string, any> = {}
  ): Promise<UploadResult> {
    try {
      new URL(imageUrl);

      const publicId = generatePublicId(userId || 'anonymous', 'images', imageUrl.split('/').pop() || 'image');

      const result = await cloudinary.uploader.upload(imageUrl, {
        public_id: publicId,
        resource_type: 'auto',
        folder: 'worldpedia',
        quality: 'auto',
        fetch_format: 'auto',
        ...options
      });

      logger.info(`✅ Image uploaded from URL: ${result.public_id}`);

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        uploadedAt: result.created_at,
        resourceType: result.resource_type
      };
    } catch (error) {
      logger.error('Failed to upload from URL:', error);
      throw error;
    }
  }

  /**
   * Replace existing image
   */
  async replaceImage(
    oldPublicId: string,
    file: Express.Multer.File,
    userId?: string
  ): Promise<UploadResult> {
    try {
      await this.deleteImage(oldPublicId);
      return await this.uploadImage(file, userId, { public_id: oldPublicId });
    } catch (error) {
      logger.error('Failed to replace image:', error);
      throw error;
    }
  }

  /**
   * Delete single image
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      logger.info(`✅ Image deleted: ${publicId}`, result);
    } catch (error) {
      logger.error(`Failed to delete image ${publicId}:`, error);
      throw error;
    }
  }

  /**
   * Delete multiple images
   */
  async deleteMultipleImages(options: DeleteOptions): Promise<DeleteResult> {
    const deleted: string[] = [];
    const failed: string[] = [];

    for (const publicId of options.publicIds) {
      try {
        await this.deleteImage(publicId);
        deleted.push(publicId);
      } catch (error) {
        failed.push(publicId);
        logger.error(`Failed to delete ${publicId}`);
      }
    }

    return {
      deleted,
      failed,
      total: options.publicIds.length,
      deletedCount: deleted.length,
      failedCount: failed.length
    };
  }

  /**
   * List all uploaded resources
   */
  async listResources(limit: number = 100, type: string = 'all'): Promise<CloudinaryResource[]> {
    try {
      const result: any = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'worldpedia',
        max_results: Math.min(limit, 500),
        resource_type: type === 'all' ? 'image' : type
      });

      return result.resources || [];
    } catch (error) {
      logger.error('Failed to list resources:', error);
      throw error;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<StorageStats> {
    try {
      const stats: any = await cloudinary.api.usage();

      return {
        totalBytes: stats.media_limits?.total_limit || 0,
        totalResources: stats.resources_count || 0,
        date: new Date().toISOString(),
        quotaBytes: stats.media_limits?.total_limit || 0,
        quotaUsedBytes: stats.media_limits?.used_limit || 0,
        quotaUsedPercent: (stats.media_limits?.used_limit! / stats.media_limits?.total_limit!) * 100 || 0
      };
    } catch (error) {
      logger.error('Failed to get storage stats:', error);
      throw error;
    }
  }

  /**
   * Get image by public ID
   */
  async getImageInfo(publicId: string): Promise<CloudinaryResource> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      logger.error(`Failed to get image info for ${publicId}:`, error);
      throw error;
    }
  }

  /**
   * Get image URL with transformations
   */
  getImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      crop?: string;
      format?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      resource_type: 'auto',
      secure: true,
      quality: options.quality || 'auto',
      fetch_format: options.format || 'auto',
      crop: options.crop || 'fill',
      width: options.width,
      height: options.height
    });
  }
}

export default new UploadService();