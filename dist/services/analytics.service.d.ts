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
export declare class AnalyticsService {
    static getDashboardAnalytics(startDate?: Date, endDate?: Date): Promise<{
        enrollments: {
            total: number;
            active: number;
            completed: number;
            completionRate: string | number;
        };
        revenue: {
            total: any;
        };
        users: {
            total: number;
        };
        courses: {
            total: number;
        };
    }>;
    static getCourseAnalytics(courseId: string): Promise<{
        enrollments: {
            total: any;
            active: any;
            completed: any;
            completionRate: string | number;
        };
        progress: {
            avgProgress: number;
        };
        revenue: {
            total: any;
            transactions: any;
        };
    }>;
    static getEnrollmentTrends(days?: number): Promise<any[]>;
    static getRevenueTrends(days?: number): Promise<any[]>;
    static getTopCourses(limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("../models").ICourse, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICourse & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    static getProgressDistribution(): Promise<{
        '0-25%': number;
        '25-50%': number;
        '50-75%': number;
        '75-100%': number;
    }>;
    static getPaymentMethodsBreakdown(): Promise<any>;
    static getLevelDistribution(): Promise<any>;
    static exportAnalytics(): Promise<import("mongoose").Document<unknown, {}, import("../models").IAnalytics, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IAnalytics & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
export default AnalyticsService;
//# sourceMappingURL=analytics.service.d.ts.map