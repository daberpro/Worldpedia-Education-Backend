import { ImageTransformOptions } from '../types/upload.types';
export declare class ImageService {
    /**
     * Get responsive variants of image
     */
    getResponsiveImages(publicId: string): {
        thumbnail: string;
        small: string;
        medium: string;
        large: string;
        original: string;
    };
    /**
     * Get image URL with custom transformations
     */
    getTransformedImage(publicId: string, options?: ImageTransformOptions): string;
    /**
     * Get profile picture variant
     */
    getProfilePictureUrl(publicId: string, size?: 'small' | 'medium' | 'large'): string;
    /**
     * Get course thumbnail variant
     */
    getCourseThumbnailUrl(publicId: string, size?: 'small' | 'medium' | 'large'): string;
    /**
     * Get certificate image variant
     */
    getCertificateImageUrl(publicId: string, width?: number, height?: number): string;
    /**
     * Generate optimized image for web
     */
    getOptimizedImage(publicId: string): string;
    /**
     * Generate image for social media sharing
     */
    getSocialMediaImage(publicId: string, platform?: 'facebook' | 'twitter' | 'instagram'): string;
    /**
     * Generate placeholder/blur image
     */
    getBlurredImage(publicId: string, blur?: number): string;
    /**
     * Convert image format
     */
    getImageAsFormat(publicId: string, format: 'jpg' | 'png' | 'webp' | 'gif'): string;
    /**
     * Get image with grayscale effect
     */
    getGrayscaleImage(publicId: string): string;
    /**
     * Get image with sepia effect
     */
    getSepiaImage(publicId: string): string;
    /**
     * Get image with border
     */
    getImageWithBorder(publicId: string, color?: string, width?: number): string;
    /**
     * Get image with watermark
     */
    getImageWithWatermark(publicId: string, watermarkId: string, options?: {
        opacity?: number;
        gravity?: string;
        width?: number;
    }): string;
}
declare const _default: ImageService;
export default _default;
//# sourceMappingURL=image.service.d.ts.map