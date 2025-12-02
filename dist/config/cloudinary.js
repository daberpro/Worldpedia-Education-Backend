"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageStats = exports.verifyCloudinaryConnection = exports.cloudinaryConfig = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("./env"));
const logger_1 = require("../utils/logger");
/**
 * Cloudinary Configuration
 */
exports.cloudinaryConfig = {
    cloud_name: env_1.default.cloudinary.cloudName,
    api_key: env_1.default.cloudinary.apiKey,
    api_secret: env_1.default.cloudinary.apiSecret
};
/**
 * Initialize Cloudinary
 */
cloudinary_1.v2.config(exports.cloudinaryConfig);
/**
 * Verify Cloudinary Connection
 */
const verifyCloudinaryConnection = async () => {
    try {
        const result = await cloudinary_1.v2.api.ping();
        logger_1.logger.info('✅ Cloudinary connection verified:', result);
    }
    catch (error) {
        logger_1.logger.error('❌ Cloudinary connection failed:', error);
        throw error;
    }
};
exports.verifyCloudinaryConnection = verifyCloudinaryConnection;
/**
 * Get Storage Statistics
 */
const getStorageStats = async () => {
    try {
        const stats = await cloudinary_1.v2.api.usage();
        return {
            totalBytes: stats.media_limits?.total_limit || 0,
            usedBytes: stats.media_limits?.used_limit || 0,
            resources: stats.resources_count || 0,
            transformations: stats.transformations_count || 0,
            bandwidth: stats.bandwidth || 0
        };
    }
    catch (error) {
        logger_1.logger.error('Failed to get Cloudinary stats:', error);
        throw error;
    }
};
exports.getStorageStats = getStorageStats;
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map