"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
/**
 * Analytics Controller - Handles dashboard analytics endpoints
 */
class AnalyticsController {
    /**
     * Get overall dashboard analytics
     * GET /api/analytics/dashboard
     */
    static async getDashboardAnalytics(req, res, next) {
        try {
            const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
            const analytics = await services_1.AnalyticsService.getDashboardAnalytics(startDate, endDate);
            res.status(200).json((0, utils_1.successResponse)(analytics));
        }
        catch (error) {
            logger_1.logger.error('Get dashboard analytics controller error', error);
            next(error);
        }
    }
    /**
     * Get course-specific analytics
     * GET /api/analytics/courses/:courseId
     */
    static async getCourseAnalytics(req, res, next) {
        try {
            const { courseId } = req.params;
            const analytics = await services_1.AnalyticsService.getCourseAnalytics(courseId);
            res.status(200).json((0, utils_1.successResponse)(analytics));
        }
        catch (error) {
            logger_1.logger.error('Get course analytics controller error', error);
            next(error);
        }
    }
    /**
     * Get enrollment trends
     * GET /api/analytics/enrollments/trends
     */
    static async getEnrollmentTrends(_req, res, next) {
        try {
            const days = parseInt(_req.query.days) || 30;
            const trends = await services_1.AnalyticsService.getEnrollmentTrends(days);
            res.status(200).json((0, utils_1.successResponse)(trends));
        }
        catch (error) {
            logger_1.logger.error('Get enrollment trends controller error', error);
            next(error);
        }
    }
    /**
     * Get revenue trends
     * GET /api/analytics/revenue/trends
     */
    static async getRevenueTrends(_req, res, next) {
        try {
            const days = parseInt(_req.query.days) || 30;
            const trends = await services_1.AnalyticsService.getRevenueTrends(days);
            res.status(200).json((0, utils_1.successResponse)(trends));
        }
        catch (error) {
            logger_1.logger.error('Get revenue trends controller error', error);
            next(error);
        }
    }
    /**
     * Get top courses by enrollment
     * GET /api/analytics/courses/top
     */
    static async getTopCourses(_req, res, next) {
        try {
            const limit = parseInt(_req.query.limit) || 10;
            const courses = await services_1.AnalyticsService.getTopCourses(limit);
            res.status(200).json((0, utils_1.successResponse)(courses));
        }
        catch (error) {
            logger_1.logger.error('Get top courses controller error', error);
            next(error);
        }
    }
    /**
     * Get student progress distribution
     * GET /api/analytics/progress/distribution
     */
    static async getProgressDistribution(_req, res, next) {
        try {
            const distribution = await services_1.AnalyticsService.getProgressDistribution();
            res.status(200).json((0, utils_1.successResponse)(distribution));
        }
        catch (error) {
            logger_1.logger.error('Get progress distribution controller error', error);
            next(error);
        }
    }
    /**
     * Get payment methods breakdown
     * GET /api/analytics/payments/methods
     */
    static async getPaymentMethodsBreakdown(_req, res, next) {
        try {
            const breakdown = await services_1.AnalyticsService.getPaymentMethodsBreakdown();
            res.status(200).json((0, utils_1.successResponse)(breakdown));
        }
        catch (error) {
            logger_1.logger.error('Get payment methods breakdown controller error', error);
            next(error);
        }
    }
    /**
     * Get level-wise enrollment distribution
     * GET /api/analytics/levels/distribution
     */
    static async getLevelDistribution(_req, res, next) {
        try {
            const distribution = await services_1.AnalyticsService.getLevelDistribution();
            res.status(200).json((0, utils_1.successResponse)(distribution));
        }
        catch (error) {
            logger_1.logger.error('Get level distribution controller error', error);
            next(error);
        }
    }
    /**
     * Export analytics
     * POST /api/analytics/export
     */
    static async exportAnalytics(_req, res, next) {
        try {
            const analytics = await services_1.AnalyticsService.exportAnalytics();
            res.status(200).json((0, utils_1.successResponse)(analytics, 'Analytics exported successfully'));
        }
        catch (error) {
            logger_1.logger.error('Export analytics controller error', error);
            next(error);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
exports.default = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map