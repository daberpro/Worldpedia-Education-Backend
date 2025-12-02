"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
class EnrollmentController {
    static async createEnrollment(req, res, next) {
        try {
            const studentId = req.user?.userId;
            const { courseId } = req.body;
            if (!courseId) {
                res.status(400).json({ success: false, error: 'Course ID is required' });
                return;
            }
            const enrollment = await services_1.EnrollmentService.createEnrollment(studentId, courseId);
            res.status(201).json((0, utils_1.createdResponse)(enrollment, 'Enrollment created successfully'));
        }
        catch (error) {
            logger_1.logger.error('Create enrollment controller error', error);
            next(error);
        }
    }
    static async getEnrollmentById(req, res, next) {
        try {
            const { id } = req.params;
            const enrollment = await services_1.EnrollmentService.getEnrollmentById(id);
            res.status(200).json((0, utils_1.successResponse)(enrollment));
        }
        catch (error) {
            logger_1.logger.error('Get enrollment controller error', error);
            next(error);
        }
    }
    static async getStudentEnrollments(req, res, next) {
        try {
            const { studentId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = { status: req.query.status };
            const result = await services_1.EnrollmentService.getStudentEnrollments(studentId, page, limit, filters);
            res.status(200).json((0, utils_1.paginatedResponse)(result.enrollments, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get student enrollments controller error', error);
            next(error);
        }
    }
    static async updateEnrollmentStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                res.status(400).json({ success: false, error: 'Status is required' });
                return;
            }
            const enrollment = await services_1.EnrollmentService.updateEnrollmentStatus(id, status);
            res.status(200).json((0, utils_1.successResponse)(enrollment, 'Enrollment status updated'));
        }
        catch (error) {
            logger_1.logger.error('Update enrollment status controller error', error);
            next(error);
        }
    }
    static async updateProgress(req, res, next) {
        try {
            const { id } = req.params;
            const { progress } = req.body;
            if (progress === undefined || progress === null) {
                res.status(400).json({ success: false, error: 'Progress is required' });
                return;
            }
            const enrollment = await services_1.EnrollmentService.updateProgress(id, progress);
            res.status(200).json((0, utils_1.successResponse)(enrollment, 'Progress updated'));
        }
        catch (error) {
            logger_1.logger.error('Update progress controller error', error);
            next(error);
        }
    }
    static async cancelEnrollment(req, res, next) {
        try {
            const { id } = req.params;
            const studentId = req.user?.userId;
            const enrollment = await services_1.EnrollmentService.cancelEnrollment(id, studentId);
            res.status(200).json((0, utils_1.successResponse)(enrollment, 'Enrollment cancelled'));
        }
        catch (error) {
            logger_1.logger.error('Cancel enrollment controller error', error);
            next(error);
        }
    }
    static async getProgressSummary(req, res, next) {
        try {
            const { studentId } = req.params;
            const summary = await services_1.EnrollmentService.getProgressSummary(studentId);
            res.status(200).json((0, utils_1.successResponse)(summary));
        }
        catch (error) {
            logger_1.logger.error('Get progress summary controller error', error);
            next(error);
        }
    }
    static async getMyEnrollments(req, res, next) {
        try {
            const studentId = req.user?.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = { status: req.query.status };
            const result = await services_1.EnrollmentService.getStudentEnrollments(studentId, page, limit, filters);
            res.status(200).json((0, utils_1.paginatedResponse)(result.enrollments, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get my enrollments controller error', error);
            next(error);
        }
    }
    static async getAllEnrollments(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await services_1.EnrollmentService.getAllEnrollments(page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.enrollments, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get all enrollments controller error', error);
            next(error);
        }
    }
}
exports.EnrollmentController = EnrollmentController;
exports.default = EnrollmentController;
//# sourceMappingURL=enrollment.controller.js.map