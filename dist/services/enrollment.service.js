"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentService = void 0;
const models_1 = require("../models");
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
class EnrollmentService {
    static async createEnrollment(studentId, courseId) {
        try {
            const student = await models_1.User.findById(studentId);
            if (!student)
                throw new error_types_1.NotFoundError('Student not found');
            const course = await models_1.Course.findById(courseId);
            if (!course)
                throw new error_types_1.NotFoundError('Course not found');
            const existingEnrollment = await models_1.Enrollment.findOne({ studentId, courseId });
            if (existingEnrollment)
                throw new error_types_1.ConflictError('Student already enrolled in this course');
            const enrollmentCount = await models_1.Enrollment.countDocuments({ courseId });
            if (enrollmentCount >= course.capacity)
                throw new error_types_1.ConflictError('Course is full');
            const enrollment = new models_1.Enrollment({
                studentId,
                courseId,
                status: 'pending_payment',
                progress: 0,
                enrolledAt: new Date()
            });
            await enrollment.save();
            course.totalEnrollments = (course.totalEnrollments || 0) + 1;
            await course.save();
            logger_1.logger.info(`Enrollment created: ${enrollment._id}`);
            return enrollment;
        }
        catch (error) {
            logger_1.logger.error('Create enrollment error', error);
            throw error;
        }
    }
    static async getEnrollmentById(enrollmentId) {
        try {
            const enrollment = await models_1.Enrollment.findById(enrollmentId)
                .populate('studentId', 'fullName email username avatar')
                .populate('courseId', 'title price level');
            if (!enrollment)
                throw new error_types_1.NotFoundError('Enrollment not found');
            return enrollment;
        }
        catch (error) {
            logger_1.logger.error('Get enrollment error', error);
            throw error;
        }
    }
    static async getStudentEnrollments(studentId, page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            const query = { studentId };
            if (filters.status)
                query.status = filters.status;
            const total = await models_1.Enrollment.countDocuments(query);
            const enrollments = await models_1.Enrollment.find(query)
                .populate('courseId', 'title description price level totalEnrollments')
                .skip(skip)
                .limit(limit)
                .sort({ enrolledAt: -1 });
            return { enrollments, total, page, limit, pages: Math.ceil(total / limit) };
        }
        catch (error) {
            logger_1.logger.error('Get student enrollments error', error);
            throw error;
        }
    }
    static async updateEnrollmentStatus(enrollmentId, status) {
        try {
            const enrollment = await models_1.Enrollment.findById(enrollmentId);
            if (!enrollment)
                throw new error_types_1.NotFoundError('Enrollment not found');
            const validStatuses = ['pending_payment', 'active', 'completed', 'cancelled'];
            if (!validStatuses.includes(status))
                throw new Error('Invalid enrollment status');
            enrollment.status = status;
            if (status === 'completed')
                enrollment.completedDate = new Date();
            await enrollment.save();
            return enrollment;
        }
        catch (error) {
            logger_1.logger.error('Update enrollment status error', error);
            throw error;
        }
    }
    static async updateProgress(enrollmentId, progress) {
        try {
            if (progress < 0 || progress > 100)
                throw new Error('Progress must be between 0 and 100');
            const enrollment = await models_1.Enrollment.findById(enrollmentId);
            if (!enrollment)
                throw new error_types_1.NotFoundError('Enrollment not found');
            enrollment.progress = progress;
            if (progress === 100 && enrollment.status !== 'completed') {
                enrollment.status = 'completed';
                enrollment.completedDate = new Date();
            }
            await enrollment.save();
            return enrollment;
        }
        catch (error) {
            logger_1.logger.error('Update progress error', error);
            throw error;
        }
    }
    static async cancelEnrollment(enrollmentId, studentId) {
        try {
            const enrollment = await models_1.Enrollment.findById(enrollmentId);
            if (!enrollment)
                throw new error_types_1.NotFoundError('Enrollment not found');
            if (enrollment.userId.toString() !== studentId) {
                throw new error_types_1.ForbiddenError('You do not have permission to cancel this enrollment');
            }
            enrollment.status = 'cancelled';
            await enrollment.save();
            return enrollment;
        }
        catch (error) {
            logger_1.logger.error('Cancel enrollment error', error);
            throw error;
        }
    }
    static async getProgressSummary(studentId) {
        try {
            const enrollments = await models_1.Enrollment.find({ userId: studentId }).populate('courseId', 'title');
            const summary = {
                totalCourses: enrollments.length,
                activeCourses: enrollments.filter(e => e.status === 'active').length,
                completedCourses: enrollments.filter(e => e.status === 'completed').length,
                avgProgress: 0,
                courses: enrollments.map(e => ({
                    courseId: e.courseId._id,
                    courseName: e.courseId.title,
                    status: e.status,
                    progress: e.progress,
                    enrolledAt: e.enrolledDate,
                    completedAt: e.completedDate
                }))
            };
            if (enrollments.length > 0) {
                summary.avgProgress = Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length);
            }
            return summary;
        }
        catch (error) {
            logger_1.logger.error('Get progress summary error', error);
            throw error;
        }
    }
    static async getAllEnrollments(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const total = await models_1.Enrollment.countDocuments();
            const enrollments = await models_1.Enrollment.find()
                .populate('studentId', 'fullName email username')
                .populate('courseId', 'title price level')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            return { enrollments, total, page, limit, pages: Math.ceil(total / limit) };
        }
        catch (error) {
            logger_1.logger.error('Get all enrollments error', error);
            throw error;
        }
    }
}
exports.EnrollmentService = EnrollmentService;
exports.default = EnrollmentService;
//# sourceMappingURL=enrollment.service.js.map