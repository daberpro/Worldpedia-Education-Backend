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
 * Course Service - Handles course management
 */
export declare class CourseService {
    /**
     * Create new course
     */
    static createCourse(courseData: any): Promise<import("mongoose").Document<unknown, {}, import("../models").ICourse, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICourse & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get course by ID
     */
    static getCourseById(courseId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").ICourse, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICourse & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get all courses with pagination and filters
     */
    static getAllCourses(page?: number, limit?: number, filters?: any): Promise<{
        courses: (import("mongoose").Document<unknown, {}, import("../models").ICourse, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICourse & Required<{
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
     * Update course
     */
    static updateCourse(courseId: string, updateData: any, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").ICourse, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICourse & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Delete course
     */
    static deleteCourse(courseId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Get course enrollments
     */
    static getCourseEnrollments(courseId: string, page?: number, limit?: number): Promise<{
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
    /**
     * Get course statistics
     */
    static getCourseStats(courseId: string): Promise<{
        courseId: string;
        totalEnrollments: number | undefined;
        activeEnrollments: number;
        completedEnrollments: number;
        avgProgress: number;
        totalRevenue: number;
        capacity: number;
        availableSeats: number;
    }>;
    /**
     * Search courses
     */
    static searchCourses(query: string, page?: number, limit?: number): Promise<{
        courses: (import("mongoose").Document<unknown, {}, import("../models").ICourse, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICourse & Required<{
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
export default CourseService;
//# sourceMappingURL=course.service.d.ts.map