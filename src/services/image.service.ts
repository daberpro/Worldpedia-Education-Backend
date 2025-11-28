import { v2 as cloudinary } from 'cloudinary';
import { ImageTransformOptions } from '../types/upload.types';

export class ImageService {
  /**
   * Get responsive variants of image
   */
  getResponsiveImages(publicId: string) {
    return {
      thumbnail: cloudinary.url(publicId, {
        width: 150,
        height: 150,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true
      }),
      small: cloudinary.url(publicId, {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true
      }),
      medium: cloudinary.url(publicId, {
        width: 600,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true
      }),
      large: cloudinary.url(publicId, {
        width: 1200,
        height: 1200,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true
      }),
      original: cloudinary.url(publicId, {
        secure: true
      })
    };
  }

  /**
   * Get image URL with custom transformations
   */
  getTransformedImage(
    publicId: string,
    options: ImageTransformOptions = {}
  ): string {
    return cloudinary.url(publicId, {
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
  getProfilePictureUrl(publicId: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
      small: 150,
      medium: 300,
      large: 500
    };

    return cloudinary.url(publicId, {
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
  getCourseThumbnailUrl(publicId: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
      small: 300,
      medium: 600,
      large: 1200
    };

    return cloudinary.url(publicId, {
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
  getCertificateImageUrl(publicId: string, width: number = 1200, height: number = 800): string {
    return cloudinary.url(publicId, {
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
  getOptimizedImage(publicId: string): string {
    return cloudinary.url(publicId, {
      quality: 80,
      fetch_format: 'auto',
      flags: 'progressive',
      secure: true
    });
  }

  /**
   * Generate image for social media sharing
   */
  getSocialMediaImage(publicId: string, platform: 'facebook' | 'twitter' | 'instagram' = 'facebook'): string {
    const dimensions = {
      facebook: { width: 1200, height: 630 },
      twitter: { width: 1024, height: 512 },
      instagram: { width: 1080, height: 1080 }
    };

    const { width, height } = dimensions[platform];

    return cloudinary.url(publicId, {
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
  getBlurredImage(publicId: string, blur: number = 50): string {
    return cloudinary.url(publicId, {
      quality: 20,
      fetch_format: 'auto',
      effect: `blur:${blur}`,
      secure: true
    });
  }

  /**
   * Convert image format
   */
  getImageAsFormat(publicId: string, format: 'jpg' | 'png' | 'webp' | 'gif'): string {
    return cloudinary.url(publicId, {
      format,
      secure: true
    });
  }

  /**
   * Get image with grayscale effect
   */
  getGrayscaleImage(publicId: string): string {
    return cloudinary.url(publicId, {
      effect: 'grayscale',
      secure: true
    });
  }

  /**
   * Get image with sepia effect
   */
  getSepiaImage(publicId: string): string {
    return cloudinary.url(publicId, {
      effect: 'sepia',
      secure: true
    });
  }

  /**
   * Get image with border
   */
  getImageWithBorder(publicId: string, color: string = 'black', width: number = 5): string {
    return cloudinary.url(publicId, {
      border: `${width}px_solid_${color}`,
      secure: true
    });
  }

  /**
   * Get image with watermark
   */
  getImageWithWatermark(
    publicId: string,
    watermarkId: string,
    options: { opacity?: number; gravity?: string; width?: number } = {}
  ): string {
    return cloudinary.url(publicId, {
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

export default new ImageService();