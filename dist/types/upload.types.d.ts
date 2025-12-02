/**
 * Upload & Image Types
 */
export interface UploadResult {
    publicId: string;
    url: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
    size: number;
    uploadedAt: string;
    resourceType: string;
}
export interface ImageValidationOptions {
    maxSize?: number;
    allowedFormats?: string[];
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
}
export interface ImageTransformOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
    gravity?: string;
}
export interface CloudinaryResource {
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    type: string;
    created_at: string;
    resource_type: string;
    secure_url: string;
    url: string;
}
export interface BulkUploadResult {
    successful: UploadResult[];
    failed: Array<{
        filename: string;
        error: string;
    }>;
    total: number;
    successCount: number;
    failureCount: number;
}
export interface StorageStats {
    totalBytes: number;
    totalResources: number;
    date: string;
    quotaBytes: number;
    quotaUsedBytes: number;
    quotaUsedPercent: number;
}
export interface DeleteOptions {
    publicIds: string[];
    resourceType?: string;
}
export interface DeleteResult {
    deleted: string[];
    failed: string[];
    total: number;
    deletedCount: number;
    failedCount: number;
}
export interface UploadedImage {
    id: string;
    publicId: string;
    url: string;
    secureUrl: string;
    width: number;
    height: number;
    size: number;
    format: string;
    uploadedAt: Date;
    uploadedBy?: string;
    relatedTo?: {
        type: 'user' | 'course' | 'certificate' | 'other';
        id: string;
    };
    tags?: string[];
    metadata?: Record<string, any>;
}
//# sourceMappingURL=upload.types.d.ts.map