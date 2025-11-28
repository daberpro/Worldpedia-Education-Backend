import { ImageValidationOptions } from '../types/upload.types';
import { logger } from './logger';

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: ImageValidationOptions = {
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
export const validateFileSize = (fileSize: number, maxSize: number = DEFAULT_OPTIONS.maxSize!): boolean => {
  if (fileSize > maxSize) {
    logger.warn(`File size ${fileSize} exceeds max ${maxSize}`);
    return false;
  }
  return true;
};

/**
 * Validate file format
 */
export const validateFileFormat = (
  filename: string,
  allowedFormats: string[] = DEFAULT_OPTIONS.allowedFormats!
): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || !allowedFormats.includes(ext)) {
    logger.warn(`Invalid file format: ${ext}`);
    return false;
  }
  return true;
};

/**
 * Validate mime type
 */
export const validateMimeType = (mimeType: string): boolean => {
  const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validMimeTypes.includes(mimeType)) {
    logger.warn(`Invalid mime type: ${mimeType}`);
    return false;
  }
  return true;
};

/**
 * Validate image dimensions
 */
export const validateDimensions = (
  width: number,
  height: number,
  options: Partial<ImageValidationOptions> = {}
): boolean => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (width > opts.maxWidth! || height > opts.maxHeight!) {
    logger.warn(`Image dimensions ${width}x${height} exceed max ${opts.maxWidth}x${opts.maxHeight}`);
    return false;
  }

  if (width < opts.minWidth! || height < opts.minHeight!) {
    logger.warn(`Image dimensions ${width}x${height} below min ${opts.minWidth}x${opts.minHeight}`);
    return false;
  }

  return true;
};

/**
 * Comprehensive file validation
 */
export const validateUploadFile = (
  file: Express.Multer.File,
  options: Partial<ImageValidationOptions> = {}
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate file exists
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }

  // Validate file size
  if (!validateFileSize(file.size, opts.maxSize)) {
    errors.push(`File size exceeds maximum of ${opts.maxSize! / 1024 / 1024}MB`);
  }

  // Validate file format
  if (!validateFileFormat(file.originalname, opts.allowedFormats)) {
    errors.push(`Invalid file format. Allowed: ${opts.allowedFormats!.join(', ')}`);
  }

  // Validate mime type
  if (!validateMimeType(file.mimetype)) {
    errors.push(`Invalid mime type: ${file.mimetype}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Generate secure public ID for Cloudinary
 */
export const generatePublicId = (userId: string, type: string, filename: string): string => {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '').split('.')[0];
  return `worldpedia/${type}/${userId}/${sanitized}_${timestamp}`;
};

/**
 * Get image dimensions from file metadata
 */
export const getImageDimensions = (_file: Express.Multer.File): { width?: number; height?: number } => {
  // This would typically use sharp or similar to get actual dimensions
  // For now, return empty object - dimensions from Cloudinary will be used
  return {};
};