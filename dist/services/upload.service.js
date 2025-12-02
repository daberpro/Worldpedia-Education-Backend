"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const logger_1 = require("../utils/logger");
const image_validator_1 = require("../utils/image-validator");
class UploadService {
    /**
     * Upload single image to Cloudinary
     */
    async uploadImage(file, userId, options = {}) {
        try {
            // Validate file
            const validation = (0, image_validator_1.validateUploadFile)(file);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }
            // Generate public ID
            const publicId = (0, image_validator_1.generatePublicId)(userId || 'anonymous', 'images', file.originalname);
            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({
                    public_id: publicId,
                    resource_type: 'auto',
                    folder: 'worldpedia',
                    quality: 'auto',
                    fetch_format: 'auto',
                    overwrite: true,
                    ...options
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                const bufferStream = stream_1.Readable.from(file.buffer);
                bufferStream.pipe(stream);
            });
            logger_1.logger.info(`✅ Image uploaded: ${result.public_id}`);
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
        }
        catch (error) {
            logger_1.logger.error('Failed to upload image:', error);
            throw error;
        }
    }
    /**
     * Upload multiple images
     */
    async uploadMultipleImages(files, userId) {
        const successful = [];
        const failed = [];
        for (const file of files) {
            try {
                const result = await this.uploadImage(file, userId);
                successful.push(result);
            }
            catch (error) {
                failed.push({
                    filename: file.originalname,
                    error: error.message
                });
                logger_1.logger.error(`Failed to upload ${file.originalname}:`, error);
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
    async uploadFromUrl(imageUrl, userId, options = {}) {
        try {
            new URL(imageUrl);
            const publicId = (0, image_validator_1.generatePublicId)(userId || 'anonymous', 'images', imageUrl.split('/').pop() || 'image');
            const result = await cloudinary_1.v2.uploader.upload(imageUrl, {
                public_id: publicId,
                resource_type: 'auto',
                folder: 'worldpedia',
                quality: 'auto',
                fetch_format: 'auto',
                ...options
            });
            logger_1.logger.info(`✅ Image uploaded from URL: ${result.public_id}`);
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
        }
        catch (error) {
            logger_1.logger.error('Failed to upload from URL:', error);
            throw error;
        }
    }
    /**
     * Replace existing image
     */
    async replaceImage(oldPublicId, file, userId) {
        try {
            await this.deleteImage(oldPublicId);
            return await this.uploadImage(file, userId, { public_id: oldPublicId });
        }
        catch (error) {
            logger_1.logger.error('Failed to replace image:', error);
            throw error;
        }
    }
    /**
     * Delete single image
     */
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            logger_1.logger.info(`✅ Image deleted: ${publicId}`, result);
        }
        catch (error) {
            logger_1.logger.error(`Failed to delete image ${publicId}:`, error);
            throw error;
        }
    }
    /**
     * Delete multiple images
     */
    async deleteMultipleImages(options) {
        const deleted = [];
        const failed = [];
        for (const publicId of options.publicIds) {
            try {
                await this.deleteImage(publicId);
                deleted.push(publicId);
            }
            catch (error) {
                failed.push(publicId);
                logger_1.logger.error(`Failed to delete ${publicId}`);
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
    async listResources(limit = 100, type = 'all') {
        try {
            const result = await cloudinary_1.v2.api.resources({
                type: 'upload',
                prefix: 'worldpedia',
                max_results: Math.min(limit, 500),
                resource_type: type === 'all' ? 'image' : type
            });
            return result.resources || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to list resources:', error);
            throw error;
        }
    }
    /**
     * Get storage statistics
     */
    async getStorageStats() {
        try {
            const stats = await cloudinary_1.v2.api.usage();
            return {
                totalBytes: stats.media_limits?.total_limit || 0,
                totalResources: stats.resources_count || 0,
                date: new Date().toISOString(),
                quotaBytes: stats.media_limits?.total_limit || 0,
                quotaUsedBytes: stats.media_limits?.used_limit || 0,
                quotaUsedPercent: (stats.media_limits?.used_limit / stats.media_limits?.total_limit) * 100 || 0
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get storage stats:', error);
            throw error;
        }
    }
    /**
     * Get image by public ID
     */
    async getImageInfo(publicId) {
        try {
            const result = await cloudinary_1.v2.api.resource(publicId);
            return result;
        }
        catch (error) {
            logger_1.logger.error(`Failed to get image info for ${publicId}:`, error);
            throw error;
        }
    }
    /**
     * Get image URL with transformations
     */
    getImageUrl(publicId, options = {}) {
        return cloudinary_1.v2.url(publicId, {
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
exports.UploadService = UploadService;
exports.default = new UploadService();
//# sourceMappingURL=upload.service.js.map