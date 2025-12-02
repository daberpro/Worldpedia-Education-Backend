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
 * Form Field Interface
 */
export interface IFormField {
    fieldId: string;
    fieldName: string;
    fieldType: 'text' | 'email' | 'number' | 'date' | 'checkbox' | 'radio' | 'select' | 'textarea';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        min?: number;
        max?: number;
    };
}
/**
 * Form Interface
 */
export interface IForm extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    fields: IFormField[];
    isActive: boolean;
    submissionCount: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Export Form Model
 */
export declare const Form: mongoose.Model<IForm, {}, {}, {}, mongoose.Document<unknown, {}, IForm, {}, mongoose.DefaultSchemaOptions> & IForm & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IForm>;
//# sourceMappingURL=Form.d.ts.map