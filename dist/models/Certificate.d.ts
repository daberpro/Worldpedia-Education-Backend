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
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import mongoose, { Document } from 'mongoose';
/**
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       type: object
 *       properties:
 *         serialNumber:
 *           type: string
 *           description: Nomor seri unik sertifikat
 *         fileName:
 *           type: string
 *           description: Nama file di Google Drive
 *         googleDriveLink:
 *           type: string
 *           description: Link download sertifikat
 *         issueDate:
 *           type: string
 *           format: date-time
 *           description: Tanggal diterbitkan
 *         status:
 *           type: string
 *           enum: [available, assigned, accessed]
 *           description: Status sertifikat
 *       example:
 *         serialNumber: "CERT-2025-00123"
 *         fileName: "certificate_john_doe.pdf"
 *         googleDriveLink: "https://drive.google.com/..."
 *         issueDate: "2025-01-20T10:30:00Z"
 *         status: "available"
 */
/**
 * Certificate Interface
 */
export interface ICertificate extends Document {
    enrollmentId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    batchId?: mongoose.Types.ObjectId;
    googleDriveFileId: string;
    googleDriveLink: string;
    fileName: string;
    sequenceNumber: number;
    serialNumber: string;
    status: 'available' | 'assigned' | 'accessed';
    issueDate: Date;
    assignedTo?: mongoose.Types.ObjectId;
    assignedDate?: Date;
    accessedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Export Certificate Model
 */
export declare const Certificate: mongoose.Model<ICertificate, {}, {}, {}, mongoose.Document<unknown, {}, ICertificate, {}, mongoose.DefaultSchemaOptions> & ICertificate & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ICertificate>;
//# sourceMappingURL=Certificate.d.ts.map