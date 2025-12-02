"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = __importDefault(require("../controllers/upload.controller"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * Public Routes (no authentication required)
 */
// Get transformed image
router.get('/:publicId/transform', upload_controller_1.default.getTransformedImage.bind(upload_controller_1.default));
// Get responsive images
router.get('/:publicId/responsive', upload_controller_1.default.getResponsiveImages.bind(upload_controller_1.default));
// Get image information
router.get('/:publicId/info', upload_controller_1.default.getImageInfo.bind(upload_controller_1.default));
/**
 * Authenticated Routes (authentication required)
 */
// Upload single image
router.post('/image', auth_1.authenticate, upload_middleware_1.uploadSingleMiddleware, upload_controller_1.default.uploadImage.bind(upload_controller_1.default));
// Upload multiple images
router.post('/images', auth_1.authenticate, upload_middleware_1.uploadMultipleMiddleware, upload_controller_1.default.uploadMultipleImages.bind(upload_controller_1.default));
// Upload from URL
router.post('/url', auth_1.authenticate, upload_controller_1.default.uploadFromUrl.bind(upload_controller_1.default));
// Replace image
router.put('/:publicId', auth_1.authenticate, upload_middleware_1.uploadSingleMiddleware, upload_controller_1.default.replaceImage.bind(upload_controller_1.default));
// Delete single image
router.delete('/:publicId', auth_1.authenticate, upload_controller_1.default.deleteImage.bind(upload_controller_1.default));
// Batch delete images
router.delete('/', auth_1.authenticate, upload_controller_1.default.batchDeleteImages.bind(upload_controller_1.default));
/**
 * Admin Routes
 */
// List all resources
router.get('/resources', auth_1.authenticate, upload_controller_1.default.listResources.bind(upload_controller_1.default));
// Get storage statistics
router.get('/stats', auth_1.authenticate, upload_controller_1.default.getStorageStats.bind(upload_controller_1.default));
exports.default = router;
//# sourceMappingURL=upload.routes.js.map