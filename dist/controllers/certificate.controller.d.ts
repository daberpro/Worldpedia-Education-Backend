import { Request, Response, NextFunction } from 'express';
/**
 * Certificate Controller - Handles certificate management endpoints
 */
export declare class CertificateController {
    /**
     * Create certificate batch
     * POST /api/certificates/batch
     */
    static createCertificateBatch(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Generate certificate for student
     * POST /api/certificates/:enrollmentId
     */
    static generateCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get certificate by ID
     * GET /api/certificates/:id
     */
    static getCertificateById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get student certificates
     * GET /api/certificates/student/:studentId
     */
    static getStudentCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get course certificates
     * GET /api/certificates/course/:courseId
     */
    static getCourseCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Verify certificate
     * GET /api/certificates/verify/:serialNumber
     */
    static verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update certificate Google Drive link
     * PATCH /api/certificates/:id/drive-link
     */
    static updateGoogleDriveLink(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get batch certificates
     * GET /api/certificates/batch/:batchId
     */
    static getBatchCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get my certificates (current user)
     * GET /api/certificates/my
     */
    static getMyCertificates(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default CertificateController;
//# sourceMappingURL=certificate.controller.d.ts.map