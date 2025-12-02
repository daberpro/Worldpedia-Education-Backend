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
 * Form Service - Handles form management
 */
export declare class FormService {
    /**
     * Create form
     */
    static createForm(formData: any, createdBy: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IForm, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IForm & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get form by ID
     */
    static getFormById(formId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IForm, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IForm & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get forms by course
     */
    static getFormsByCourse(courseId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models").IForm, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IForm & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    /**
     * Update form
     */
    static updateForm(formId: string, updateData: any, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IForm, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IForm & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Delete form
     */
    static deleteForm(formId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Submit form
     */
    static submitForm(formId: string, studentId: string, responses: any): Promise<import("mongoose").Document<unknown, {}, import("../models").IFormSubmission, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IFormSubmission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get form submissions
     */
    static getFormSubmissions(formId: string, page?: number, limit?: number): Promise<{
        submissions: (import("mongoose").Document<unknown, {}, import("../models").IFormSubmission, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IFormSubmission & Required<{
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
     * Get student submission
     */
    static getStudentSubmission(formId: string, studentId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IFormSubmission, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IFormSubmission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get form analytics
     */
    static getFormAnalytics(formId: string): Promise<{
        formId: string;
        totalSubmissions: number;
        completionRate: number;
        fieldAnalytics: any;
    }>;
    /**
     * Validate form responses
     */
    private static validateResponses;
}
export default FormService;
//# sourceMappingURL=form.service.d.ts.map