"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const models_1 = require("../models");
const logger_1 = require("../utils/logger");
class AnalyticsService {
    static async getDashboardAnalytics(startDate, endDate) {
        try {
            const dateFilter = startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};
            const [totalEnrollments, activeEnrollments, completedEnrollments, totalUsers, totalCourses, revenueStats] = await Promise.all([
                models_1.Enrollment.countDocuments(dateFilter),
                models_1.Enrollment.countDocuments({ ...dateFilter, status: 'active' }),
                models_1.Enrollment.countDocuments({ ...dateFilter, status: 'completed' }),
                models_1.User.countDocuments(),
                models_1.Course.countDocuments({ isActive: true }),
                models_1.Payment.aggregate([
                    { $match: { status: 'settlement', ...dateFilter } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ])
            ]);
            const totalRevenue = revenueStats[0]?.total || 0;
            const completionRate = totalEnrollments > 0 ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2) : 0;
            return {
                enrollments: { total: totalEnrollments, active: activeEnrollments, completed: completedEnrollments, completionRate },
                revenue: { total: totalRevenue },
                users: { total: totalUsers },
                courses: { total: totalCourses }
            };
        }
        catch (error) {
            logger_1.logger.error('Dashboard analytics error', error);
            throw error;
        }
    }
    static async getCourseAnalytics(courseId) {
        try {
            const enrollmentStats = await models_1.Enrollment.aggregate([
                { $match: { courseId: courseId } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                        avgProgress: { $avg: "$progress" }
                    }
                }
            ]);
            const revenueStats = await models_1.Payment.aggregate([
                { $match: { courseId: courseId, status: 'settlement' } },
                { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
            ]);
            const stats = enrollmentStats[0] || { total: 0, active: 0, completed: 0, avgProgress: 0 };
            const rev = revenueStats[0] || { total: 0, count: 0 };
            const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(2) : 0;
            return {
                enrollments: { total: stats.total, active: stats.active, completed: stats.completed, completionRate },
                progress: { avgProgress: Math.round(stats.avgProgress) },
                revenue: { total: rev.total, transactions: rev.count }
            };
        }
        catch (error) {
            logger_1.logger.error('Get course analytics error', error);
            throw error;
        }
    }
    static async getEnrollmentTrends(days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            return await models_1.Enrollment.aggregate([
                { $match: { enrolledDate: { $gte: startDate } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$enrolledDate" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
                { $project: { date: "$_id", enrollments: "$count", _id: 0 } }
            ]);
        }
        catch (error) {
            logger_1.logger.error('Enrollment trends error', error);
            throw error;
        }
    }
    static async getRevenueTrends(days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            return await models_1.Payment.aggregate([
                { $match: { status: 'settlement', paidAt: { $gte: startDate } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } }, dailyRevenue: { $sum: "$amount" }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
                { $project: { date: "$_id", revenue: "$dailyRevenue", transactions: "$count", _id: 0 } }
            ]);
        }
        catch (error) {
            logger_1.logger.error('Revenue trends error', error);
            throw error;
        }
    }
    static async getTopCourses(limit = 10) {
        return await models_1.Course.find({ isActive: true }).select('title level totalEnrollments totalRevenue').sort({ totalEnrollments: -1 }).limit(limit);
    }
    static async getProgressDistribution() {
        try {
            const result = await models_1.Enrollment.aggregate([
                { $bucket: { groupBy: "$progress", boundaries: [0, 25, 50, 75, 100], default: "100", output: { count: { $sum: 1 } } } }
            ]);
            const dist = { '0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0 };
            result.forEach((b) => {
                if (b._id === 0)
                    dist['0-25%'] = b.count;
                else if (b._id === 25)
                    dist['25-50%'] = b.count;
                else if (b._id === 50)
                    dist['50-75%'] = b.count;
                else
                    dist['75-100%'] += b.count;
            });
            return dist;
        }
        catch (error) {
            logger_1.logger.error('Progress dist error', error);
            throw error;
        }
    }
    static async getPaymentMethodsBreakdown() {
        try {
            const result = await models_1.Payment.aggregate([
                { $match: { status: 'settlement' } },
                { $group: { _id: "$paymentMethod", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
                { $sort: { count: -1 } }
            ]);
            const breakdown = {};
            result.forEach(item => { breakdown[item._id] = { count: item.count, total: item.totalAmount }; });
            return breakdown;
        }
        catch (error) {
            logger_1.logger.error('Payment breakdown error', error);
            throw error;
        }
    }
    static async getLevelDistribution() {
        try {
            const result = await models_1.Course.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: "$level", courses: { $sum: 1 }, enrollments: { $sum: "$totalEnrollments" } } },
                { $sort: { enrollments: -1 } }
            ]);
            const dist = {};
            result.forEach(item => { dist[item._id] = { courses: item.courses, enrollments: item.enrollments }; });
            return dist;
        }
        catch (error) {
            logger_1.logger.error('Level dist error', error);
            throw error;
        }
    }
    static async exportAnalytics() {
        try {
            const data = await this.getDashboardAnalytics();
            const analytics = new models_1.Analytics({ type: 'revenue', data, period: new Date() });
            await analytics.save();
            return analytics;
        }
        catch (error) {
            logger_1.logger.error('Export error', error);
            throw error;
        }
    }
}
exports.AnalyticsService = AnalyticsService;
exports.default = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map