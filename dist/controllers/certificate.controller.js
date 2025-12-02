"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
/**
 * Certificate Controller - Handles certificate management endpoints
 */
class CertificateController {
    /**
     * Create certificate batch
     * POST /api/certificates/batch
     */
    static async createCertificateBatch(req, res, next) {
        try {
            const { courseId, batchName, googleDriveFolderId, certificateCount } = req.body;
            if (!courseId || !batchName || !googleDriveFolderId || !certificateCount) {
                res.status(400).json({
                    success: false,
                    error: 'All fields are required'
                });
                return;
            }
            const batch = await services_1.CertificateService.createCertificateBatch(req.body);
            res.status(201).json((0, utils_1.createdResponse)(batch, 'Certificate batch created successfully'));
        }
        catch (error) {
            logger_1.logger.error('Create certificate batch controller error', error);
            next(error);
        }
    }
    /**
     * Generate certificate for student
     * POST /api/certificates/:enrollmentId
     */
    static async generateCertificate(req, res, next) {
        try {
            const { enrollmentId } = req.params;
            const certificate = await services_1.CertificateService.generateCertificate(enrollmentId);
            res.status(201).json((0, utils_1.createdResponse)(certificate, 'Certificate generated successfully'));
        }
        catch (error) {
            logger_1.logger.error('Generate certificate controller error', error);
            next(error);
        }
    }
    /**
     * Get certificate by ID
     * GET /api/certificates/:id
     */
    static async getCertificateById(req, res, next) {
        try {
            const { id } = req.params;
            const certificate = await services_1.CertificateService.getCertificateById(id);
            res.status(200).json((0, utils_1.successResponse)(certificate));
        }
        catch (error) {
            logger_1.logger.error('Get certificate controller error', error);
            next(error);
        }
    }
    /**
     * Get student certificates
     * GET /api/certificates/student/:studentId
     */
    static async getStudentCertificates(req, res, next) {
        try {
            const { studentId } = req.params;
            const certificates = await services_1.CertificateService.getStudentCertificates(studentId);
            res.status(200).json((0, utils_1.successResponse)(certificates));
        }
        catch (error) {
            logger_1.logger.error('Get student certificates controller error', error);
            next(error);
        }
    }
    /**
     * Get course certificates
     * GET /api/certificates/course/:courseId
     */
    static async getCourseCertificates(req, res, next) {
        try {
            const { courseId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await services_1.CertificateService.getCourseCertificates(courseId, page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.certificates, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get course certificates controller error', error);
            next(error);
        }
    }
    /**
     * Verify certificate
     * GET /api/certificates/verify/:serialNumber
     */
    static async verifyCertificate(req, res, next) {
        try {
            const { serialNumber } = req.params;
            const result = await services_1.CertificateService.verifyCertificate(serialNumber);
            res.status(200).json((0, utils_1.successResponse)(result));
        }
        catch (error) {
            logger_1.logger.error('Verify certificate controller error', error);
            next(error);
        }
    }
    /**
     * Update certificate Google Drive link
     * PATCH /api/certificates/:id/drive-link
     */
    static async updateGoogleDriveLink(req, res, next) {
        try {
            const { id } = req.params;
            const { driveLink } = req.body;
            if (!driveLink) {
                res.status(400).json({
                    success: false,
                    error: 'Drive link is required'
                });
                return;
            }
            const certificate = await services_1.CertificateService.updateGoogleDriveLink(id, driveLink);
            res.status(200).json((0, utils_1.successResponse)(certificate, 'Google Drive link updated'));
        }
        catch (error) {
            logger_1.logger.error('Update Google Drive link controller error', error);
            next(error);
        }
    }
    /**
     * Get batch certificates
     * GET /api/certificates/batch/:batchId
     */
    static async getBatchCertificates(req, res, next) {
        try {
            const { batchId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await services_1.CertificateService.getBatchCertificates(batchId, page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.certificates, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get batch certificates controller error', error);
            next(error);
        }
    }
    /**
     * Get my certificates (current user)
     * GET /api/certificates/my
     */
    static async getMyCertificates(req, res, next) {
        try {
            const studentId = req.user?.userId;
            const certificates = await services_1.CertificateService.getStudentCertificates(studentId);
            res.status(200).json((0, utils_1.successResponse)(certificates));
        }
        catch (error) {
            logger_1.logger.error('Get my certificates controller error', error);
            next(error);
        }
    }
}
exports.CertificateController = CertificateController;
exports.default = CertificateController;
//# sourceMappingURL=certificate.controller.js.map