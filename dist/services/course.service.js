"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const models_1 = require("../models");
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
/**
 * Course Service - Handles course management
 */
class CourseService {
    /**
     * Create new course
     */
    static async createCourse(courseData) {
        try {
            const { title } = courseData;
            // Check if course already exists
            const existingCourse = await models_1.Course.findOne({ title: title.toLowerCase() });
            if (existingCourse) {
                throw new error_types_1.ConflictError('Course with this title already exists');
            }
            const course = new models_1.Course({
                ...courseData,
                title: title.toLowerCase(),
                createdBy: courseData.createdBy,
                totalEnrollments: 0,
                totalRevenue: 0
            });
            await course.save();
            logger_1.logger.info(`Course created: ${course._id}`);
            return course;
        }
        catch (error) {
            logger_1.logger.error('Create course error', error);
            throw error;
        }
    }
    /**
     * Get course by ID
     */
    static async getCourseById(courseId) {
        try {
            const course = await models_1.Course.findById(courseId).populate('createdBy', 'fullName email');
            if (!course) {
                throw new error_types_1.NotFoundError('Course not found');
            }
            return course;
        }
        catch (error) {
            logger_1.logger.error('Get course error', error);
            throw error;
        }
    }
    /**
     * Get all courses with pagination and filters
     */
    static async getAllCourses(page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            const query = { isActive: true };
            // Apply filters
            if (filters.level)
                query.level = filters.level;
            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.minPrice !== undefined)
                query.price = { $gte: filters.minPrice };
            if (filters.maxPrice !== undefined) {
                query.price = query.price ? { ...query.price, $lte: filters.maxPrice } : { $lte: filters.maxPrice };
            }
            const total = await models_1.Course.countDocuments(query);
            const courses = await models_1.Course.find(query)
                .select('-moduleDetails')
                .populate('createdBy', 'fullName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            return {
                courses,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Get all courses error', error);
            throw error;
        }
    }
    /**
     * Update course
     */
    static async updateCourse(courseId, updateData, userId) {
        try {
            const course = await models_1.Course.findById(courseId);
            if (!course) {
                throw new error_types_1.NotFoundError('Course not found');
            }
            // Check authorization
            if (course.createdBy.toString() !== userId) {
                throw new error_types_1.ForbiddenError('You do not have permission to update this course');
            }
            // Update fields
            Object.assign(course, updateData);
            await course.save();
            logger_1.logger.info(`Course updated: ${courseId}`);
            return course;
        }
        catch (error) {
            logger_1.logger.error('Update course error', error);
            throw error;
        }
    }
    /**
     * Delete course
     */
    static async deleteCourse(courseId, userId) {
        try {
            const course = await models_1.Course.findById(courseId);
            if (!course) {
                throw new error_types_1.NotFoundError('Course not found');
            }
            // Check authorization
            if (course.createdBy.toString() !== userId) {
                throw new error_types_1.ForbiddenError('You do not have permission to delete this course');
            }
            // Check if course has enrollments
            const enrollmentCount = await models_1.Enrollment.countDocuments({ courseId });
            if (enrollmentCount > 0) {
                throw new error_types_1.ConflictError('Cannot delete course with active enrollments');
            }
            await models_1.Course.deleteOne({ _id: courseId });
            logger_1.logger.info(`Course deleted: ${courseId}`);
            return { message: 'Course deleted successfully' };
        }
        catch (error) {
            logger_1.logger.error('Delete course error', error);
            throw error;
        }
    }
    /**
     * Get course enrollments
     */
    static async getCourseEnrollments(courseId, page = 1, limit = 10) {
        try {
            const course = await models_1.Course.findById(courseId);
            if (!course) {
                throw new error_types_1.NotFoundError('Course not found');
            }
            const skip = (page - 1) * limit;
            const total = await models_1.Enrollment.countDocuments({ courseId });
            const enrollments = await models_1.Enrollment.find({ courseId })
                .populate('studentId', 'fullName email username')
                .skip(skip)
                .limit(limit)
                .sort({ enrolledAt: -1 });
            return {
                enrollments,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Get course enrollments error', error);
            throw error;
        }
    }
    /**
     * Get course statistics
     */
    static async getCourseStats(courseId) {
        try {
            const course = await models_1.Course.findById(courseId);
            if (!course) {
                throw new error_types_1.NotFoundError('Course not found');
            }
            const enrollments = await models_1.Enrollment.find({ courseId });
            const completedCount = enrollments.filter(e => e.status === 'completed').length;
            const activeCount = enrollments.filter(e => e.status === 'active').length;
            const avgProgress = enrollments.length > 0
                ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
                : 0;
            return {
                courseId,
                totalEnrollments: course.totalEnrollments,
                activeEnrollments: activeCount,
                completedEnrollments: completedCount,
                avgProgress: Math.round(avgProgress),
                totalRevenue: course.totalRevenue,
                capacity: course.capacity,
                availableSeats: course.capacity - enrollments.length
            };
        }
        catch (error) {
            logger_1.logger.error('Get course stats error', error);
            throw error;
        }
    }
    /**
     * Search courses
     */
    static async searchCourses(query, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const searchQuery = {
                isActive: true,
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            };
            const total = await models_1.Course.countDocuments(searchQuery);
            const courses = await models_1.Course.find(searchQuery)
                .select('-moduleDetails')
                .populate('createdBy', 'fullName email')
                .skip(skip)
                .limit(limit);
            return {
                courses,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Search courses error', error);
            throw error;
        }
    }
}
exports.CourseService = CourseService;
exports.default = CourseService;
//# sourceMappingURL=course.service.js.map