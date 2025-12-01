import { Analytics, Enrollment, Payment, Course, User } from '../models';
import { logger } from '../utils/logger';

/**
 * Analytics Service - Implementation using MongoDB Aggregation Framework
 * Optimized for performance and scalability.
 */
export class AnalyticsService {
  
  /**
   * Get Dashboard Overview
   * Uses parallel execution of optimized count queries and aggregation
   */
  static async getDashboardAnalytics(startDate?: Date, endDate?: Date) {
    try {
      const dateFilter = startDate && endDate ? { 
        createdAt: { $gte: startDate, $lte: endDate } 
      } : {};

      const [
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalUsers,
        totalCourses,
        revenueStats
      ] = await Promise.all([
        Enrollment.countDocuments(dateFilter),
        Enrollment.countDocuments({ ...dateFilter, status: 'active' }),
        Enrollment.countDocuments({ ...dateFilter, status: 'completed' }),
        User.countDocuments(),
        Course.countDocuments({ isActive: true }),
        // Aggregation for Revenue
        Payment.aggregate([
            { $match: { status: 'settlement', ...dateFilter } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
      ]);

      const totalRevenue = revenueStats[0]?.total || 0;
      const completionRate = totalEnrollments > 0 
        ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2) 
        : 0;

      return {
        enrollments: {
          total: totalEnrollments,
          active: activeEnrollments,
          completed: completedEnrollments,
          completionRate
        },
        revenue: {
          total: totalRevenue
        },
        users: {
          total: totalUsers
        },
        courses: {
          total: totalCourses
        }
      };
    } catch (error) {
      logger.error('Dashboard analytics error', error);
      throw error;
    }
  }

  /**
   * Get course-specific analytics using Aggregation
   */
  static async getCourseAnalytics(courseId: string) {
    try {
      // Aggregate Enrollments
      const enrollmentStats = await Enrollment.aggregate([
        { $match: { courseId: courseId as any } },
        { 
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
            avgProgress: { $avg: "$progress" }
          }
        }
      ]);

      // Aggregate Revenue
      const revenueStats = await Payment.aggregate([
        { $match: { courseId: courseId as any, status: 'settlement' } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
      ]);

      const stats = enrollmentStats[0] || { total: 0, active: 0, completed: 0, cancelled: 0, avgProgress: 0 };
      const rev = revenueStats[0] || { total: 0, count: 0 };

      const completionRate = stats.total > 0
        ? ((stats.completed / stats.total) * 100).toFixed(2)
        : 0;

      return {
        courseId,
        enrollments: {
          total: stats.total,
          active: stats.active,
          completed: stats.completed,
          cancelled: stats.cancelled,
          completionRate
        },
        progress: {
          avgProgress: Math.round(stats.avgProgress)
        },
        revenue: {
          total: rev.total,
          transactions: rev.count
        }
      };
    } catch (error) {
      logger.error('Get course analytics error', error);
      throw error;
    }
  }

  /**
   * Get Enrollment Trends (Daily) using Aggregation
   */
  static async getEnrollmentTrends(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = await Enrollment.aggregate([
        { $match: { enrolledDate: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$enrolledDate" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", enrollments: "$count", _id: 0 } }
      ]);

      return {
        period: `Last ${days} days`,
        data: result
      };
    } catch (error) {
      logger.error('Aggregation enrollment error', error);
      throw error;
    }
  }

  /**
   * Get Revenue Trends (Daily) using Aggregation
   */
  static async getRevenueTrends(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = await Payment.aggregate([
        { 
          $match: { 
            status: 'settlement', 
            paidAt: { $gte: startDate } 
          } 
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
            dailyRevenue: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", revenue: "$dailyRevenue", transactions: "$count", _id: 0 } }
      ]);

      return {
        period: `Last ${days} days`,
        data: result
      };
    } catch (error) {
      logger.error('Aggregation revenue error', error);
      throw error;
    }
  }

  /**
   * Get Top Courses by Enrollment
   */
  static async getTopCourses(limit: number = 10) {
    try {
      return await Course.find({ isActive: true })
        .select('title level totalEnrollments totalRevenue price')
        .sort({ totalEnrollments: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Get top courses error', error);
      throw error;
    }
  }

  /**
   * Get Progress Distribution using $bucket Aggregation
   */
  static async getProgressDistribution() {
    try {
      const result = await Enrollment.aggregate([
        {
          $bucket: {
            groupBy: "$progress",
            boundaries: [0, 25, 50, 75, 100],
            default: "100", // For strictly 100
            output: {
              count: { $sum: 1 }
            }
          }
        }
      ]);

      // Format result for frontend
      const distribution = {
        '0-25%': 0,
        '25-50%': 0,
        '50-75%': 0,
        '75-100%': 0
      };

      result.forEach((bucket: any) => {
        if (bucket._id === 0) distribution['0-25%'] = bucket.count;
        else if (bucket._id === 25) distribution['25-50%'] = bucket.count;
        else if (bucket._id === 50) distribution['50-75%'] = bucket.count;
        else distribution['75-100%'] += bucket.count; // 75 and "100"
      });

      return distribution;
    } catch (error) {
      logger.error('Aggregation progress error', error);
      throw error;
    }
  }

  /**
   * Get Payment Methods Breakdown
   */
  static async getPaymentMethodsBreakdown() {
    try {
      const result = await Payment.aggregate([
        { $match: { status: 'settlement' } },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const breakdown: any = {};
      result.forEach(item => {
        breakdown[item._id] = {
          count: item.count,
          total: item.totalAmount
        };
      });

      return breakdown;
    } catch (error) {
      logger.error('Get payment methods breakdown error', error);
      throw error;
    }
  }

  /**
   * Get Level Distribution
   */
  static async getLevelDistribution() {
    try {
      const result = await Course.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: "$level",
            courses: { $sum: 1 },
            enrollments: { $sum: "$totalEnrollments" }
          }
        },
        { $sort: { enrollments: -1 } }
      ]);

      const distribution: any = {};
      result.forEach(item => {
        distribution[item._id] = {
          courses: item.courses,
          enrollments: item.enrollments
        };
      });

      return distribution;
    } catch (error) {
      logger.error('Get level distribution error', error);
      throw error;
    }
  }

  /**
   * Export Analytics Data Snapshot
   */
  static async exportAnalytics() {
    try {
      const dashboardData = await this.getDashboardAnalytics();

      const analytics = new Analytics({
        type: 'revenue', // Default type required by schema
        data: dashboardData,
        period: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await analytics.save();
      logger.info(`Analytics snapshot exported: ${analytics._id}`);

      return analytics;
    } catch (error) {
      logger.error('Export analytics error', error);
      throw error;
    }
  }
}

export default AnalyticsService;