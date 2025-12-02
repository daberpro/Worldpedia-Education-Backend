"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormService = void 0;
const models_1 = require("../models");
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
/**
 * Form Service - Handles form management
 */
class FormService {
    /**
     * Create form
     */
    static async createForm(formData, createdBy) {
        try {
            const { title, courseId, fields } = formData;
            // Validate fields
            if (!Array.isArray(fields) || fields.length === 0) {
                throw new error_types_1.ValidationError('Form must have at least one field', { fields: 'At least one field required' });
            }
            const form = new models_1.Form({
                title,
                courseId,
                fields,
                createdBy,
                isActive: true,
                submissionCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await form.save();
            logger_1.logger.info(`Form created: ${form._id}`);
            return form;
        }
        catch (error) {
            logger_1.logger.error('Create form error', error);
            throw error;
        }
    }
    /**
     * Get form by ID
     */
    static async getFormById(formId) {
        try {
            const form = await models_1.Form.findById(formId)
                .populate('courseId', 'title')
                .populate('createdBy', 'fullName email');
            if (!form) {
                throw new error_types_1.NotFoundError('Form not found');
            }
            return form;
        }
        catch (error) {
            logger_1.logger.error('Get form error', error);
            throw error;
        }
    }
    /**
     * Get forms by course
     */
    static async getFormsByCourse(courseId) {
        try {
            const forms = await models_1.Form.find({ courseId, isActive: true })
                .select('title description submissionCount')
                .sort({ createdAt: -1 });
            return forms;
        }
        catch (error) {
            logger_1.logger.error('Get forms by course error', error);
            throw error;
        }
    }
    /**
     * Update form
     */
    static async updateForm(formId, updateData, userId) {
        try {
            const form = await models_1.Form.findById(formId);
            if (!form) {
                throw new error_types_1.NotFoundError('Form not found');
            }
            // Check authorization
            if (form.createdBy.toString() !== userId) {
                throw new error_types_1.ForbiddenError('You do not have permission to update this form');
            }
            Object.assign(form, updateData);
            form.updatedAt = new Date();
            await form.save();
            logger_1.logger.info(`Form updated: ${formId}`);
            return form;
        }
        catch (error) {
            logger_1.logger.error('Update form error', error);
            throw error;
        }
    }
    /**
     * Delete form
     */
    static async deleteForm(formId, userId) {
        try {
            const form = await models_1.Form.findById(formId);
            if (!form) {
                throw new error_types_1.NotFoundError('Form not found');
            }
            // Check authorization
            if (form.createdBy.toString() !== userId) {
                throw new error_types_1.ForbiddenError('You do not have permission to delete this form');
            }
            await models_1.Form.deleteOne({ _id: formId });
            logger_1.logger.info(`Form deleted: ${formId}`);
            return { message: 'Form deleted successfully' };
        }
        catch (error) {
            logger_1.logger.error('Delete form error', error);
            throw error;
        }
    }
    /**
     * Submit form
     */
    static async submitForm(formId, studentId, responses) {
        try {
            const form = await models_1.Form.findById(formId);
            if (!form) {
                throw new error_types_1.NotFoundError('Form not found');
            }
            if (!form.isActive) {
                throw new Error('Form is not accepting submissions');
            }
            // Validate responses
            this.validateResponses(form.fields, responses);
            const submission = new models_1.FormSubmission({
                formId,
                studentId,
                responses,
                submittedAt: new Date()
            });
            await submission.save();
            // Update submission count
            form.submissionCount = (form.submissionCount || 0) + 1;
            await form.save();
            logger_1.logger.info(`Form submitted: ${submission._id}`);
            return submission;
        }
        catch (error) {
            logger_1.logger.error('Submit form error', error);
            throw error;
        }
    }
    /**
     * Get form submissions
     */
    static async getFormSubmissions(formId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const total = await models_1.FormSubmission.countDocuments({ formId });
            const submissions = await models_1.FormSubmission.find({ formId })
                .populate('studentId', 'fullName email username')
                .skip(skip)
                .limit(limit)
                .sort({ submittedAt: -1 });
            return {
                submissions,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Get form submissions error', error);
            throw error;
        }
    }
    /**
     * Get student submission
     */
    static async getStudentSubmission(formId, studentId) {
        try {
            const submission = await models_1.FormSubmission.findOne({ formId, studentId });
            if (!submission) {
                throw new error_types_1.NotFoundError('Submission not found');
            }
            return submission;
        }
        catch (error) {
            logger_1.logger.error('Get student submission error', error);
            throw error;
        }
    }
    /**
     * Get form analytics
     */
    static async getFormAnalytics(formId) {
        try {
            const form = await models_1.Form.findById(formId);
            if (!form) {
                throw new error_types_1.NotFoundError('Form not found');
            }
            const submissions = await models_1.FormSubmission.find({ formId });
            const fields = form.fields;
            const analytics = {
                formId,
                totalSubmissions: submissions.length,
                completionRate: 0,
                fieldAnalytics: fields.map((field) => ({
                    fieldId: field.fieldId,
                    fieldName: field.fieldName,
                    fieldType: field.fieldType,
                    responseCounts: {}
                }))
            };
            // Calculate analytics for each field
            submissions.forEach(submission => {
                Object.keys(submission.responses).forEach(fieldId => {
                    const response = submission.responses[fieldId];
                    const fieldAnalytic = analytics.fieldAnalytics.find((f) => f.fieldId === fieldId);
                    if (fieldAnalytic) {
                        if (!fieldAnalytic.responseCounts[response]) {
                            fieldAnalytic.responseCounts[response] = 0;
                        }
                        fieldAnalytic.responseCounts[response]++;
                    }
                });
            });
            analytics.completionRate = submissions.length > 0 ? 100 : 0;
            return analytics;
        }
        catch (error) {
            logger_1.logger.error('Get form analytics error', error);
            throw error;
        }
    }
    /**
     * Validate form responses
     */
    static validateResponses(fields, responses) {
        fields.forEach(field => {
            if (field.required && !responses[field.fieldId]) {
                throw new error_types_1.ValidationError('Validation failed', { [field.fieldName]: 'This field is required' });
            }
            // Add more validation rules as needed
            if (field.fieldType === 'email' && responses[field.fieldId]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(responses[field.fieldId])) {
                    throw new error_types_1.ValidationError('Validation failed', { [field.fieldName]: 'Invalid email format' });
                }
            }
        });
    }
}
exports.FormService = FormService;
exports.default = FormService;
//# sourceMappingURL=form.service.js.map