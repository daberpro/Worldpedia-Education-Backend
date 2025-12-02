"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.uploadMultipleMiddleware = exports.uploadSingleMiddleware = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
/**
 * Configure multer for file uploads
 * Uses memory storage for temp file handling
 */
const storage = multer_1.default.memoryStorage();
/**
 * File filter for images only
 */
const fileFilter = (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    // Check MIME type
    if (!allowedMimes.includes(file.mimetype)) {
        const error = new Error(`Invalid file type: ${file.mimetype}`);
        logger_1.logger.warn(`Upload rejected: Invalid MIME type ${file.mimetype}`);
        return cb(error);
    }
    // Check file extension
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (!allowedExts.includes(ext)) {
        const error = new Error(`Invalid file extension: ${ext}`);
        logger_1.logger.warn(`Upload rejected: Invalid extension ${ext}`);
        return cb(error);
    }
    cb(null, true);
};
/**
 * Multer configuration
 */
exports.uploadMiddleware = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
        files: 10 // Max 10 files per request
    }
});
/**
 * Single file upload middleware
 */
exports.uploadSingleMiddleware = exports.uploadMiddleware.single('file');
/**
 * Multiple files upload middleware
 */
exports.uploadMultipleMiddleware = exports.uploadMiddleware.array('files', 10);
/**
 * Error handling for multer
 */
const handleUploadError = (error, _req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        logger_1.logger.error('Multer error:', error);
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                error: 'File too large. Maximum size is 5MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(413).json({
                success: false,
                error: 'Too many files. Maximum is 10 files'
            });
        }
    }
    if (error) {
        logger_1.logger.error('Upload error:', error);
        return res.status(400).json({
            success: false,
            error: error.message || 'Upload failed'
        });
    }
    next();
};
exports.handleUploadError = handleUploadError;
//# sourceMappingURL=upload.middleware.js.map