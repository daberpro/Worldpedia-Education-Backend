"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const cloudinary_1 = require("cloudinary");
class ImageService {
    /**
     * Get responsive variants of image
     */
    getResponsiveImages(publicId) {
        return {
            thumbnail: cloudinary_1.v2.url(publicId, {
                width: 150,
                height: 150,
                crop: 'fill',
                quality: 'auto',
                fetch_format: 'auto',
                secure: true
            }),
            small: cloudinary_1.v2.url(publicId, {
                width: 300,
                height: 300,
                crop: 'fill',
                quality: 'auto',
                fetch_format: 'auto',
                secure: true
            }),
            medium: cloudinary_1.v2.url(publicId, {
                width: 600,
                height: 600,
                crop: 'fill',
                quality: 'auto',
                fetch_format: 'auto',
                secure: true
            }),
            large: cloudinary_1.v2.url(publicId, {
                width: 1200,
                height: 1200,
                crop: 'fill',
                quality: 'auto',
                fetch_format: 'auto',
                secure: true
            }),
            original: cloudinary_1.v2.url(publicId, {
                secure: true
            })
        };
    }
    /**
     * Get image URL with custom transformations
     */
    getTransformedImage(publicId, options = {}) {
        return cloudinary_1.v2.url(publicId, {
            width: options.width,
            height: options.height,
            crop: options.crop || 'fill',
            gravity: options.gravity || 'auto',
            quality: options.quality ? options.quality.toString() : 'auto',
            fetch_format: options.format || 'auto',
            secure: true
        });
    }
    /**
     * Get profile picture variant
     */
    getProfilePictureUrl(publicId, size = 'medium') {
        const sizes = {
            small: 150,
            medium: 300,
            large: 500
        };
        return cloudinary_1.v2.url(publicId, {
            width: sizes[size],
            height: sizes[size],
            crop: 'fill',
            gravity: 'face',
            quality: 'auto',
            fetch_format: 'auto',
            secure: true
        });
    }
    /**
     * Get course thumbnail variant
     */
    getCourseThumbnailUrl(publicId, size = 'medium') {
        const sizes = {
            small: 300,
            medium: 600,
            large: 1200
        };
        return cloudinary_1.v2.url(publicId, {
            width: sizes[size],
            height: sizes[size],
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
            secure: true
        });
    }
    /**
     * Get certificate image variant
     */
    getCertificateImageUrl(publicId, width = 1200, height = 800) {
        return cloudinary_1.v2.url(publicId, {
            width,
            height,
            crop: 'fill',
            quality: 'high',
            fetch_format: 'jpg',
            secure: true
        });
    }
    /**
     * Generate optimized image for web
     */
    getOptimizedImage(publicId) {
        return cloudinary_1.v2.url(publicId, {
            quality: 80,
            fetch_format: 'auto',
            flags: 'progressive',
            secure: true
        });
    }
    /**
     * Generate image for social media sharing
     */
    getSocialMediaImage(publicId, platform = 'facebook') {
        const dimensions = {
            facebook: { width: 1200, height: 630 },
            twitter: { width: 1024, height: 512 },
            instagram: { width: 1080, height: 1080 }
        };
        const { width, height } = dimensions[platform];
        return cloudinary_1.v2.url(publicId, {
            width,
            height,
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
            secure: true
        });
    }
    /**
     * Generate placeholder/blur image
     */
    getBlurredImage(publicId, blur = 50) {
        return cloudinary_1.v2.url(publicId, {
            quality: 20,
            fetch_format: 'auto',
            effect: `blur:${blur}`,
            secure: true
        });
    }
    /**
     * Convert image format
     */
    getImageAsFormat(publicId, format) {
        return cloudinary_1.v2.url(publicId, {
            format,
            secure: true
        });
    }
    /**
     * Get image with grayscale effect
     */
    getGrayscaleImage(publicId) {
        return cloudinary_1.v2.url(publicId, {
            effect: 'grayscale',
            secure: true
        });
    }
    /**
     * Get image with sepia effect
     */
    getSepiaImage(publicId) {
        return cloudinary_1.v2.url(publicId, {
            effect: 'sepia',
            secure: true
        });
    }
    /**
     * Get image with border
     */
    getImageWithBorder(publicId, color = 'black', width = 5) {
        return cloudinary_1.v2.url(publicId, {
            border: `${width}px_solid_${color}`,
            secure: true
        });
    }
    /**
     * Get image with watermark
     */
    getImageWithWatermark(publicId, watermarkId, options = {}) {
        return cloudinary_1.v2.url(publicId, {
            overlay: {
                public_id: watermarkId,
                gravity: options.gravity || 'south_east',
                width: options.width || 100,
                opacity: options.opacity || 50
            },
            secure: true
        });
    }
}
exports.ImageService = ImageService;
exports.default = new ImageService();
//# sourceMappingURL=image.service.js.map