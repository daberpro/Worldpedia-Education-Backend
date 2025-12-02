"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageDimensions = exports.generatePublicId = exports.validateUploadFile = exports.validateDimensions = exports.validateMimeType = exports.validateFileFormat = exports.validateFileSize = void 0;
const logger_1 = require("./logger");
/**
 * Default validation options
 */
const DEFAULT_OPTIONS = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maxWidth: 4000,
    maxHeight: 4000,
    minWidth: 100,
    minHeight: 100
};
/**
 * Validate file size
 */
const validateFileSize = (fileSize, maxSize = DEFAULT_OPTIONS.maxSize) => {
    if (fileSize > maxSize) {
        logger_1.logger.warn(`File size ${fileSize} exceeds max ${maxSize}`);
        return false;
    }
    return true;
};
exports.validateFileSize = validateFileSize;
/**
 * Validate file format
 */
const validateFileFormat = (filename, allowedFormats = DEFAULT_OPTIONS.allowedFormats) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext || !allowedFormats.includes(ext)) {
        logger_1.logger.warn(`Invalid file format: ${ext}`);
        return false;
    }
    return true;
};
exports.validateFileFormat = validateFileFormat;
/**
 * Validate mime type
 */
const validateMimeType = (mimeType) => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimeTypes.includes(mimeType)) {
        logger_1.logger.warn(`Invalid mime type: ${mimeType}`);
        return false;
    }
    return true;
};
exports.validateMimeType = validateMimeType;
/**
 * Validate image dimensions
 */
const validateDimensions = (width, height, options = {}) => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    if (width > opts.maxWidth || height > opts.maxHeight) {
        logger_1.logger.warn(`Image dimensions ${width}x${height} exceed max ${opts.maxWidth}x${opts.maxHeight}`);
        return false;
    }
    if (width < opts.minWidth || height < opts.minHeight) {
        logger_1.logger.warn(`Image dimensions ${width}x${height} below min ${opts.minWidth}x${opts.minHeight}`);
        return false;
    }
    return true;
};
exports.validateDimensions = validateDimensions;
/**
 * Comprehensive file validation
 */
const validateUploadFile = (file, options = {}) => {
    const errors = [];
    const opts = { ...DEFAULT_OPTIONS, ...options };
    // Validate file exists
    if (!file) {
        errors.push('No file provided');
        return { valid: false, errors };
    }
    // Validate file size
    if (!(0, exports.validateFileSize)(file.size, opts.maxSize)) {
        errors.push(`File size exceeds maximum of ${opts.maxSize / 1024 / 1024}MB`);
    }
    // Validate file format
    if (!(0, exports.validateFileFormat)(file.originalname, opts.allowedFormats)) {
        errors.push(`Invalid file format. Allowed: ${opts.allowedFormats.join(', ')}`);
    }
    // Validate mime type
    if (!(0, exports.validateMimeType)(file.mimetype)) {
        errors.push(`Invalid mime type: ${file.mimetype}`);
    }
    return {
        valid: errors.length === 0,
        errors
    };
};
exports.validateUploadFile = validateUploadFile;
/**
 * Generate secure public ID for Cloudinary
 */
const generatePublicId = (userId, type, filename) => {
    const timestamp = Date.now();
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '').split('.')[0];
    return `worldpedia/${type}/${userId}/${sanitized}_${timestamp}`;
};
exports.generatePublicId = generatePublicId;
/**
 * Get image dimensions from file metadata
 */
const getImageDimensions = (_file) => {
    // This would typically use sharp or similar to get actual dimensions
    // For now, return empty object - dimensions from Cloudinary will be used
    return {};
};
exports.getImageDimensions = getImageDimensions;
//# sourceMappingURL=image-validator.js.map