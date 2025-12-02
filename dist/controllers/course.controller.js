"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
/**
 * Course Controller - Handles course management endpoints
 */
class CourseController {
    /**
     * Create new course
     * POST /api/courses
     */
    static async createCourse(req, res, next) {
        try {
            const userId = req.user?.userId;
            const courseData = { ...req.body, createdBy: userId };
            const course = await services_1.CourseService.createCourse(courseData);
            res.status(201).json((0, utils_1.createdResponse)(course, 'Course created successfully'));
        }
        catch (error) {
            logger_1.logger.error('Create course controller error', error);
            next(error);
        }
    }
    /**
     * Get course by ID
     * GET /api/courses/:id
     */
    static async getCourseById(req, res, next) {
        try {
            const { id } = req.params;
            const course = await services_1.CourseService.getCourseById(id);
            res.status(200).json((0, utils_1.successResponse)(course));
        }
        catch (error) {
            logger_1.logger.error('Get course controller error', error);
            next(error);
        }
    }
    /**
     * Get all courses with pagination
     * GET /api/courses
     */
    static async getAllCourses(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                level: req.query.level,
                search: req.query.search,
                minPrice: req.query.minPrice ? parseInt(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice) : undefined
            };
            const result = await services_1.CourseService.getAllCourses(page, limit, filters);
            res.status(200).json((0, utils_1.paginatedResponse)(result.courses, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get all courses controller error', error);
            next(error);
        }
    }
    /**
     * Update course
     * PUT /api/courses/:id
     */
    static async updateCourse(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const course = await services_1.CourseService.updateCourse(id, req.body, userId);
            res.status(200).json((0, utils_1.successResponse)(course, 'Course updated successfully'));
        }
        catch (error) {
            logger_1.logger.error('Update course controller error', error);
            next(error);
        }
    }
    /**
     * Delete course
     * DELETE /api/courses/:id
     */
    static async deleteCourse(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const result = await services_1.CourseService.deleteCourse(id, userId);
            res.status(200).json((0, utils_1.deletedResponse)(result.message));
        }
        catch (error) {
            logger_1.logger.error('Delete course controller error', error);
            next(error);
        }
    }
    /**
     * Get course enrollments
     * GET /api/courses/:id/enrollments
     */
    static async getCourseEnrollments(req, res, next) {
        try {
            const { id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await services_1.CourseService.getCourseEnrollments(id, page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.enrollments, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get course enrollments controller error', error);
            next(error);
        }
    }
    /**
     * Get course statistics
     * GET /api/courses/:id/stats
     */
    static async getCourseStats(req, res, next) {
        try {
            const { id } = req.params;
            const stats = await services_1.CourseService.getCourseStats(id);
            res.status(200).json((0, utils_1.successResponse)(stats));
        }
        catch (error) {
            logger_1.logger.error('Get course stats controller error', error);
            next(error);
        }
    }
    /**
     * Search courses
     * GET /api/courses/search
     */
    static async searchCourses(req, res, next) {
        try {
            const query = req.query.q;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                res.status(400).json({
                    success: false,
                    error: 'Search query is required'
                });
                return;
            }
            const result = await services_1.CourseService.searchCourses(query, page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.courses, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Search courses controller error', error);
            next(error);
        }
    }
}
exports.CourseController = CourseController;
exports.default = CourseController;
//# sourceMappingURL=course.controller.js.map