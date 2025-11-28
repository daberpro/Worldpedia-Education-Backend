import { v2 as cloudinary } from 'cloudinary';
import config from './env';
import { logger } from '../utils/logger';

/**
 * Cloudinary Configuration
 */
export const cloudinaryConfig = {
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
};

/**
 * Initialize Cloudinary
 */
cloudinary.config(cloudinaryConfig);

/**
 * Verify Cloudinary Connection
 */
export const verifyCloudinaryConnection = async (): Promise<void> => {
  try {
    const result = await cloudinary.api.ping();
    logger.info('✅ Cloudinary connection verified:', result);
  } catch (error) {
    logger.error('❌ Cloudinary connection failed:', error);
    throw error;
  }
};

/**
 * Get Storage Statistics
 */
export const getStorageStats = async () => {
  try {
    const stats = await cloudinary.api.usage();
    return {
      totalBytes: stats.media_limits?.total_limit || 0,
      usedBytes: stats.media_limits?.used_limit || 0,
      resources: stats.resources_count || 0,
      transformations: stats.transformations_count || 0,
      bandwidth: stats.bandwidth || 0
    };
  } catch (error) {
    logger.error('Failed to get Cloudinary stats:', error);
    throw error;
  }
};

export default cloudinary;