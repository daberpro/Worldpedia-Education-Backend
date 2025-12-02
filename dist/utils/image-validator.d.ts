/// <reference types="node" />
import { ImageValidationOptions } from '../types/upload.types';
/**
 * Validate file size
 */
export declare const validateFileSize: (fileSize: number, maxSize?: number) => boolean;
/**
 * Validate file format
 */
export declare const validateFileFormat: (filename: string, allowedFormats?: string[]) => boolean;
/**
 * Validate mime type
 */
export declare const validateMimeType: (mimeType: string) => boolean;
/**
 * Validate image dimensions
 */
export declare const validateDimensions: (width: number, height: number, options?: Partial<ImageValidationOptions>) => boolean;
/**
 * Comprehensive file validation
 */
export declare const validateUploadFile: (file: Express.Multer.File, options?: Partial<ImageValidationOptions>) => {
    valid: boolean;
    errors: string[];
};
/**
 * Generate secure public ID for Cloudinary
 */
export declare const generatePublicId: (userId: string, type: string, filename: string) => string;
/**
 * Get image dimensions from file metadata
 */
export declare const getImageDimensions: (_file: Express.Multer.File) => {
    width?: number;
    height?: number;
};
//# sourceMappingURL=image-validator.d.ts.map