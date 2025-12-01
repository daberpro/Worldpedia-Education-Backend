import { Analytics, Enrollment, Payment, Course, User } from '../models';
import { logger } from '../utils/logger';

export class AnalyticsService {
  static async getDashboardAnalytics(startDate?: Date, endDate?: Date) {
    try {
      const dateFilter = startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};

      const [totalEnrollments, activeEnrollments, completedEnrollments, totalUsers, totalCourses, revenueStats] = await Promise.all([
        Enrollment.countDocuments(dateFilter),
        Enrollment.countDocuments({ ...dateFilter, status: 'active' }),
        Enrollment.countDocuments({ ...dateFilter, status: 'completed' }),
        User.countDocuments(),
        Course.countDocuments({ isActive: true }),
        Payment.aggregate([
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
    } catch (error) {
      logger.error('Dashboard analytics error', error);
      throw error;
    }
  }

  static async getCourseAnalytics(courseId: string) {
    try {
      const enrollmentStats = await Enrollment.aggregate([
        { $match: { courseId: courseId as any } },
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

      const revenueStats = await Payment.aggregate([
        { $match: { courseId: courseId as any, status: 'settlement' } },
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
    } catch (error) {
      logger.error('Get course analytics error', error);
      throw error;
    }
  }

  static async getEnrollmentTrends(days: number = 30) {
    try {
      const startDate = new Date(); startDate.setDate(startDate.getDate() - days);
      return await Enrollment.aggregate([
        { $match: { enrolledDate: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$enrolledDate" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", enrollments: "$count", _id: 0 } }
      ]);
    } catch (error) {
      logger.error('Enrollment trends error', error);
      throw error;
    }
  }

  static async getRevenueTrends(days: number = 30) {
    try {
      const startDate = new Date(); startDate.setDate(startDate.getDate() - days);
      return await Payment.aggregate([
        { $match: { status: 'settlement', paidAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } }, dailyRevenue: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", revenue: "$dailyRevenue", transactions: "$count", _id: 0 } }
      ]);
    } catch (error) {
      logger.error('Revenue trends error', error);
      throw error;
    }
  }

  static async getTopCourses(limit: number = 10) {
    return await Course.find({ isActive: true }).select('title level totalEnrollments totalRevenue').sort({ totalEnrollments: -1 }).limit(limit);
  }

  static async getProgressDistribution() {
    try {
      const result = await Enrollment.aggregate([
        { $bucket: { groupBy: "$progress", boundaries: [0, 25, 50, 75, 100], default: "100", output: { count: { $sum: 1 } } } }
      ]);
      const dist = { '0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0 };
      result.forEach((b: any) => {
        if (b._id === 0) dist['0-25%'] = b.count;
        else if (b._id === 25) dist['25-50%'] = b.count;
        else if (b._id === 50) dist['50-75%'] = b.count;
        else dist['75-100%'] += b.count;
      });
      return dist;
    } catch (error) {
      logger.error('Progress dist error', error);
      throw error;
    }
  }

  static async getPaymentMethodsBreakdown() {
    try {
      const result = await Payment.aggregate([
        { $match: { status: 'settlement' } },
        { $group: { _id: "$paymentMethod", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
        { $sort: { count: -1 } }
      ]);
      const breakdown: any = {};
      result.forEach(item => { breakdown[item._id] = { count: item.count, total: item.totalAmount }; });
      return breakdown;
    } catch (error) {
      logger.error('Payment breakdown error', error);
      throw error;
    }
  }

  static async getLevelDistribution() {
    try {
      const result = await Course.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$level", courses: { $sum: 1 }, enrollments: { $sum: "$totalEnrollments" } } },
        { $sort: { enrollments: -1 } }
      ]);
      const dist: any = {};
      result.forEach(item => { dist[item._id] = { courses: item.courses, enrollments: item.enrollments }; });
      return dist;
    } catch (error) {
      logger.error('Level dist error', error);
      throw error;
    }
  }

  static async exportAnalytics() {
    try {
      const data = await this.getDashboardAnalytics();
      const analytics = new Analytics({ type: 'revenue', data, period: new Date() });
      await analytics.save();
      return analytics;
    } catch (error) {
      logger.error('Export error', error);
      throw error;
    }
  }
}

export default AnalyticsService;