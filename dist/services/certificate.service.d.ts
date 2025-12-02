/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
/**
 * Certificate Service - Handles certificate management
 */
export declare class CertificateService {
    /**
     * Create certificate batch
     */
    static createCertificateBatch(batchData: any): Promise<import("mongoose").Document<unknown, {}, import("../models").ICertificateBatch, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICertificateBatch & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Generate certificate for student
     */
    static generateCertificate(enrollmentId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").ICertificate, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICertificate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get certificate by ID
     */
    static getCertificateById(certificateId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").ICertificate, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICertificate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get student certificates
     */
    static getStudentCertificates(studentId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models").ICertificate, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICertificate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    /**
     * Get course certificates
     */
    static getCourseCertificates(courseId: string, page?: number, limit?: number): Promise<{
        certificates: (import("mongoose").Document<unknown, {}, import("../models").ICertificate, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICertificate & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    /**
     * Verify certificate
     */
    static verifyCertificate(serialNumber: string): Promise<{
        valid: boolean;
        certificate: {
            serialNumber: string;
            studentName: any;
            courseName: any;
            issueDate: Date;
            status: "available" | "assigned" | "accessed";
        };
    }>;
    /**
     * Update certificate Google Drive link
     */
    static updateGoogleDriveLink(certificateId: string, driveLink: string): Promise<import("mongoose").Document<unknown, {}, import("../models").ICertificate, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICertificate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get batch certificates
     */
    static getBatchCertificates(batchId: string, page?: number, limit?: number): Promise<{
        certificates: (import("mongoose").Document<unknown, {}, import("../models").ICertificate, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICertificate & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    /**
     * Generate serial number
     */
    private static generateSerialNumber;
}
export default CertificateService;
//# sourceMappingURL=certificate.service.d.ts.map