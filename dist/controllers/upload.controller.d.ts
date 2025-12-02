import { Request, Response } from 'express';
export declare class UploadController {
    /**
     * Upload single image
     */
    uploadImage(req: Request, res: Response): Promise<void>;
    /**
     * Upload multiple images
     */
    uploadMultipleImages(req: Request, res: Response): Promise<void>;
    /**
     * Upload image from URL
     */
    uploadFromUrl(req: Request, res: Response): Promise<void>;
    /**
     * Replace existing image
     */
    replaceImage(req: Request, res: Response): Promise<void>;
    /**
     * Delete image
     */
    deleteImage(req: Request, res: Response): Promise<void>;
    /**
     * Batch delete images
     */
    batchDeleteImages(req: Request, res: Response): Promise<void>;
    /**
     * List uploaded resources
     */
    listResources(req: Request, res: Response): Promise<void>;
    /**
     * Get storage statistics
     */
    getStorageStats(_req: Request, res: Response): Promise<void>;
    /**
     * Get image information
     */
    getImageInfo(req: Request, res: Response): Promise<void>;
    /**
     * Get responsive images
     */
    getResponsiveImages(req: Request, res: Response): Promise<void>;
    /**
     * Get transformed image
     */
    getTransformedImage(req: Request, res: Response): Promise<void>;
}
declare const _default: UploadController;
export default _default;
//# sourceMappingURL=upload.controller.d.ts.map