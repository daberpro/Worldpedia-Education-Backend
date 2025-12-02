import { v2 as cloudinary } from 'cloudinary';
/**
 * Cloudinary Configuration
 */
export declare const cloudinaryConfig: {
    cloud_name: string | undefined;
    api_key: string | undefined;
    api_secret: string | undefined;
};
/**
 * Verify Cloudinary Connection
 */
export declare const verifyCloudinaryConnection: () => Promise<void>;
/**
 * Get Storage Statistics
 */
export declare const getStorageStats: () => Promise<{
    totalBytes: any;
    usedBytes: any;
    resources: any;
    transformations: any;
    bandwidth: any;
}>;
export default cloudinary;
//# sourceMappingURL=cloudinary.d.ts.map