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
 * FormSubmission Interface
 */
export interface IFormSubmission extends Document {
    formId: mongoose.Types.ObjectId;
    enrollmentId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    responses: Record<string, any>;
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Export FormSubmission Model
 */
export declare const FormSubmission: mongoose.Model<IFormSubmission, {}, {}, {}, mongoose.Document<unknown, {}, IFormSubmission, {}, mongoose.DefaultSchemaOptions> & IFormSubmission & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IFormSubmission>;
//# sourceMappingURL=FormSubmission.d.ts.map