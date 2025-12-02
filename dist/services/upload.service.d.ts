/// <reference types="multer" />
import { UploadResult, BulkUploadResult, StorageStats, DeleteResult, DeleteOptions, CloudinaryResource } from '../types/upload.types';
export declare class UploadService {
    /**
     * Upload single image to Cloudinary
     */
    uploadImage(file: Express.Multer.File, userId?: string, options?: Record<string, any>): Promise<UploadResult>;
    /**
     * Upload multiple images
     */
    uploadMultipleImages(files: Express.Multer.File[], userId?: string): Promise<BulkUploadResult>;
    /**
     * Upload image from URL
     */
    uploadFromUrl(imageUrl: string, userId?: string, options?: Record<string, any>): Promise<UploadResult>;
    /**
     * Replace existing image
     */
    replaceImage(oldPublicId: string, file: Express.Multer.File, userId?: string): Promise<UploadResult>;
    /**
     * Delete single image
     */
    deleteImage(publicId: string): Promise<void>;
    /**
     * Delete multiple images
     */
    deleteMultipleImages(options: DeleteOptions): Promise<DeleteResult>;
    /**
     * List all uploaded resources
     */
    listResources(limit?: number, type?: string): Promise<CloudinaryResource[]>;
    /**
     * Get storage statistics
     */
    getStorageStats(): Promise<StorageStats>;
    /**
     * Get image by public ID
     */
    getImageInfo(publicId: string): Promise<CloudinaryResource>;
    /**
     * Get image URL with transformations
     */
    getImageUrl(publicId: string, options?: {
        width?: number;
        height?: number;
        quality?: string;
        crop?: string;
        format?: string;
    }): string;
}
declare const _default: UploadService;
export default _default;
//# sourceMappingURL=upload.service.d.ts.map