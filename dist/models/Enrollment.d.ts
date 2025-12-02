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
 * Enrollment Interface
 */
export interface IEnrollment extends Document {
    userId: mongoose.Types.ObjectId;
    studentId?: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    status: 'pending_payment' | 'active' | 'completed' | 'cancelled';
    enrolledDate: Date;
    enrolledAt?: Date;
    progress: number;
    completedDate?: Date;
    completedAt?: Date;
    certificateId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Export Enrollment Model
 */
export declare const Enrollment: mongoose.Model<IEnrollment, {}, {}, {}, mongoose.Document<unknown, {}, IEnrollment, {}, mongoose.DefaultSchemaOptions> & IEnrollment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IEnrollment>;
//# sourceMappingURL=Enrollment.d.ts.map