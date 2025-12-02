"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
/**
 * Form Controller - Handles form creation and submission endpoints
 */
class FormController {
    /**
     * Create form
     * POST /api/forms
     */
    static async createForm(req, res, next) {
        try {
            const userId = req.user?.userId;
            const formData = { ...req.body, createdBy: userId };
            const form = await services_1.FormService.createForm(formData, userId);
            res.status(201).json((0, utils_1.createdResponse)(form, 'Form created successfully'));
        }
        catch (error) {
            logger_1.logger.error('Create form controller error', error);
            next(error);
        }
    }
    /**
     * Get form by ID
     * GET /api/forms/:id
     */
    static async getFormById(req, res, next) {
        try {
            const { id } = req.params;
            const form = await services_1.FormService.getFormById(id);
            res.status(200).json((0, utils_1.successResponse)(form));
        }
        catch (error) {
            logger_1.logger.error('Get form controller error', error);
            next(error);
        }
    }
    /**
     * Get forms by course
     * GET /api/forms/course/:courseId
     */
    static async getFormsByCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const forms = await services_1.FormService.getFormsByCourse(courseId);
            res.status(200).json((0, utils_1.successResponse)(forms));
        }
        catch (error) {
            logger_1.logger.error('Get forms by course controller error', error);
            next(error);
        }
    }
    /**
     * Update form
     * PUT /api/forms/:id
     */
    static async updateForm(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const form = await services_1.FormService.updateForm(id, req.body, userId);
            res.status(200).json((0, utils_1.successResponse)(form, 'Form updated successfully'));
        }
        catch (error) {
            logger_1.logger.error('Update form controller error', error);
            next(error);
        }
    }
    /**
     * Delete form
     * DELETE /api/forms/:id
     */
    static async deleteForm(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const result = await services_1.FormService.deleteForm(id, userId);
            res.status(200).json((0, utils_1.deletedResponse)(result.message));
        }
        catch (error) {
            logger_1.logger.error('Delete form controller error', error);
            next(error);
        }
    }
    /**
     * Submit form
     * POST /api/forms/:id/submit
     */
    static async submitForm(req, res, next) {
        try {
            const { id } = req.params;
            const studentId = req.user?.userId;
            const { responses } = req.body;
            if (!responses) {
                res.status(400).json({
                    success: false,
                    error: 'Form responses are required'
                });
                return;
            }
            const submission = await services_1.FormService.submitForm(id, studentId, responses);
            res.status(201).json((0, utils_1.createdResponse)(submission, 'Form submitted successfully'));
        }
        catch (error) {
            logger_1.logger.error('Submit form controller error', error);
            next(error);
        }
    }
    /**
     * Get form submissions
     * GET /api/forms/:id/submissions
     */
    static async getFormSubmissions(req, res, next) {
        try {
            const { id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await services_1.FormService.getFormSubmissions(id, page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.submissions, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get form submissions controller error', error);
            next(error);
        }
    }
    /**
     * Get student submission
     * GET /api/forms/:id/my-submission
     */
    static async getStudentSubmission(req, res, next) {
        try {
            const { id } = req.params;
            const studentId = req.user?.userId;
            const submission = await services_1.FormService.getStudentSubmission(id, studentId);
            res.status(200).json((0, utils_1.successResponse)(submission));
        }
        catch (error) {
            logger_1.logger.error('Get student submission controller error', error);
            next(error);
        }
    }
    /**
     * Get form analytics
     * GET /api/forms/:id/analytics
     */
    static async getFormAnalytics(req, res, next) {
        try {
            const { id } = req.params;
            const analytics = await services_1.FormService.getFormAnalytics(id);
            res.status(200).json((0, utils_1.successResponse)(analytics));
        }
        catch (error) {
            logger_1.logger.error('Get form analytics controller error', error);
            next(error);
        }
    }
}
exports.FormController = FormController;
exports.default = FormController;
//# sourceMappingURL=form.controller.js.map