"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const upload_service_1 = __importDefault(require("../services/upload.service"));
const image_service_1 = __importDefault(require("../services/image.service"));
const logger_1 = require("../utils/logger");
class UploadController {
    /**
     * Upload single image
     */
    async uploadImage(req, res) {
        try {
            const file = req.file;
            const userId = req.user?.userId;
            if (!file) {
                res.status(400).json({
                    success: false,
                    error: 'No file provided'
                });
                return;
            }
            const result = await upload_service_1.default.uploadImage(file, userId);
            res.status(201).json({
                success: true,
                data: result,
                message: 'Image uploaded successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error uploading image:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to upload image'
            });
        }
    }
    /**
     * Upload multiple images
     */
    async uploadMultipleImages(req, res) {
        try {
            const files = req.files;
            const userId = req.user?.userId;
            if (!files || files.length === 0) {
                res.status(400).json({
                    success: false,
                    error: 'No files provided'
                });
                return;
            }
            const result = await upload_service_1.default.uploadMultipleImages(files, userId);
            res.status(201).json({
                success: true,
                data: result,
                message: `${result.successCount} images uploaded successfully`
            });
        }
        catch (error) {
            logger_1.logger.error('Error uploading images:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to upload images'
            });
        }
    }
    /**
     * Upload image from URL
     */
    async uploadFromUrl(req, res) {
        try {
            const { imageUrl } = req.body;
            const userId = req.user?.userId;
            if (!imageUrl) {
                res.status(400).json({
                    success: false,
                    error: 'Image URL is required'
                });
                return;
            }
            const result = await upload_service_1.default.uploadFromUrl(imageUrl, userId);
            res.status(201).json({
                success: true,
                data: result,
                message: 'Image uploaded successfully from URL'
            });
        }
        catch (error) {
            logger_1.logger.error('Error uploading from URL:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to upload from URL'
            });
        }
    }
    /**
     * Replace existing image
     */
    async replaceImage(req, res) {
        try {
            const { publicId } = req.params;
            const file = req.file;
            const userId = req.user?.userId;
            if (!file) {
                res.status(400).json({
                    success: false,
                    error: 'No file provided'
                });
                return;
            }
            const result = await upload_service_1.default.replaceImage(publicId, file, userId);
            res.status(200).json({
                success: true,
                data: result,
                message: 'Image replaced successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error replacing image:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to replace image'
            });
        }
    }
    /**
     * Delete image
     */
    async deleteImage(req, res) {
        try {
            const { publicId } = req.params;
            await upload_service_1.default.deleteImage(publicId);
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error deleting image:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to delete image'
            });
        }
    }
    /**
     * Batch delete images
     */
    async batchDeleteImages(req, res) {
        try {
            const { publicIds } = req.body;
            if (!publicIds || !Array.isArray(publicIds)) {
                res.status(400).json({
                    success: false,
                    error: 'publicIds array is required'
                });
                return;
            }
            const result = await upload_service_1.default.deleteMultipleImages({ publicIds });
            res.status(200).json({
                success: true,
                data: result,
                message: `${result.deletedCount} images deleted successfully`
            });
        }
        catch (error) {
            logger_1.logger.error('Error deleting images:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to delete images'
            });
        }
    }
    /**
     * List uploaded resources
     */
    async listResources(req, res) {
        try {
            const { limit = 100, type = 'all' } = req.query;
            const resources = await upload_service_1.default.listResources(parseInt(limit), type);
            res.status(200).json({
                success: true,
                data: resources,
                count: resources.length,
                message: 'Resources retrieved successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error listing resources:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to list resources'
            });
        }
    }
    /**
     * Get storage statistics
     */
    async getStorageStats(_req, res) {
        try {
            const stats = await upload_service_1.default.getStorageStats();
            res.status(200).json({
                success: true,
                data: stats,
                message: 'Storage statistics retrieved successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting storage stats:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to get storage statistics'
            });
        }
    }
    /**
     * Get image information
     */
    async getImageInfo(req, res) {
        try {
            const { publicId } = req.params;
            const info = await upload_service_1.default.getImageInfo(publicId);
            res.status(200).json({
                success: true,
                data: info,
                message: 'Image information retrieved successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting image info:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to get image information'
            });
        }
    }
    /**
     * Get responsive images
     */
    async getResponsiveImages(req, res) {
        try {
            const { publicId } = req.params;
            const images = image_service_1.default.getResponsiveImages(publicId);
            res.status(200).json({
                success: true,
                data: images,
                message: 'Responsive images retrieved successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting responsive images:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to get responsive images'
            });
        }
    }
    /**
     * Get transformed image
     */
    async getTransformedImage(req, res) {
        try {
            const { publicId } = req.params;
            const { width, height, quality, crop, format, gravity } = req.query;
            const url = image_service_1.default.getTransformedImage(publicId, {
                width: width ? parseInt(width) : undefined,
                height: height ? parseInt(height) : undefined,
                quality: quality ? parseInt(quality) : undefined,
                crop: crop,
                format: format,
                gravity: gravity
            });
            res.status(200).json({
                success: true,
                data: { url },
                message: 'Transformed image URL retrieved successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting transformed image:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to get transformed image'
            });
        }
    }
}
exports.UploadController = UploadController;
exports.default = new UploadController();
//# sourceMappingURL=upload.controller.js.map