import { Request, Response, NextFunction } from 'express';
/**
 * Analytics Controller - Handles dashboard analytics endpoints
 */
export declare class AnalyticsController {
    /**
     * Get overall dashboard analytics
     * GET /api/analytics/dashboard
     */
    static getDashboardAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get course-specific analytics
     * GET /api/analytics/courses/:courseId
     */
    static getCourseAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get enrollment trends
     * GET /api/analytics/enrollments/trends
     */
    static getEnrollmentTrends(_req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get revenue trends
     * GET /api/analytics/revenue/trends
     */
    static getRevenueTrends(_req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get top courses by enrollment
     * GET /api/analytics/courses/top
     */
    static getTopCourses(_req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get student progress distribution
     * GET /api/analytics/progress/distribution
     */
    static getProgressDistribution(_req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get payment methods breakdown
     * GET /api/analytics/payments/methods
     */
    static getPaymentMethodsBreakdown(_req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get level-wise enrollment distribution
     * GET /api/analytics/levels/distribution
     */
    static getLevelDistribution(_req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Export analytics
     * POST /api/analytics/export
     */
    static exportAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default AnalyticsController;
//# sourceMappingURL=analytics.controller.d.ts.map