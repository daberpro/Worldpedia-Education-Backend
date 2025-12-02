"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * Analytics Routes
 * Base: /api/analytics
 * All routes require authentication and admin role
 */
// Dashboard analytics
router.get('/dashboard', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.getDashboardAnalytics);
// Course analytics
router.get('/courses/:courseId', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.getCourseAnalytics);
// Enrollment trends
router.get('/enrollments/trends', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.getEnrollmentTrends);
// Revenue analytics
router.get('/revenue/trends', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.getRevenueTrends);
// Course rankings
router.get('/courses/top', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.getTopCourses);
// Progress distribution
router.get('/progress/distribution', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.getProgressDistribution);
// Payment methods
router.get('/payments/methods', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.getPaymentMethodsBreakdown);
// Level distribution
router.get('/levels/distribution', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.getLevelDistribution);
// Export analytics
router.post('/export', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.AnalyticsController.exportAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map