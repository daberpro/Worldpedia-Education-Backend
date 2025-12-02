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
export declare class EnrollmentService {
    static createEnrollment(studentId: string, courseId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IEnrollment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IEnrollment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static getEnrollmentById(enrollmentId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IEnrollment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IEnrollment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static getStudentEnrollments(studentId: string, page?: number, limit?: number, filters?: any): Promise<{
        enrollments: (import("mongoose").Document<unknown, {}, import("../models").IEnrollment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IEnrollment & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    static updateEnrollmentStatus(enrollmentId: string, status: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IEnrollment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IEnrollment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static updateProgress(enrollmentId: string, progress: number): Promise<import("mongoose").Document<unknown, {}, import("../models").IEnrollment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IEnrollment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static cancelEnrollment(enrollmentId: string, studentId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IEnrollment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IEnrollment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static getProgressSummary(studentId: string): Promise<{
        totalCourses: number;
        activeCourses: number;
        completedCourses: number;
        avgProgress: number;
        courses: {
            courseId: any;
            courseName: any;
            status: "pending_payment" | "active" | "completed" | "cancelled";
            progress: number;
            enrolledAt: Date;
            completedAt: Date | undefined;
        }[];
    }>;
    static getAllEnrollments(page?: number, limit?: number): Promise<{
        enrollments: (import("mongoose").Document<unknown, {}, import("../models").IEnrollment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IEnrollment & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
}
export default EnrollmentService;
//# sourceMappingURL=enrollment.service.d.ts.map