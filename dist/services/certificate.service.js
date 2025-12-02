"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const models_1 = require("../models");
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
/**
 * Certificate Service - Handles certificate management
 */
class CertificateService {
    /**
     * Create certificate batch
     */
    static async createCertificateBatch(batchData) {
        try {
            const { courseId, batchName, googleDriveFolderId, certificateCount } = batchData;
            const course = await models_1.Course.findById(courseId);
            if (!course) {
                throw new error_types_1.NotFoundError('Course not found');
            }
            const batch = new models_1.CertificateBatch({
                courseId,
                batchName,
                googleDriveFolderId,
                certificateCount,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await batch.save();
            logger_1.logger.info(`Certificate batch created: ${batch._id}`);
            return batch;
        }
        catch (error) {
            logger_1.logger.error('Create certificate batch error', error);
            throw error;
        }
    }
    /**
     * Generate certificate for student
     */
    static async generateCertificate(enrollmentId) {
        try {
            const enrollment = await models_1.Enrollment.findById(enrollmentId)
                .populate('studentId')
                .populate('courseId');
            if (!enrollment) {
                throw new error_types_1.NotFoundError('Enrollment not found');
            }
            if (enrollment.status !== 'completed') {
                throw new Error('Student must complete the course to get certificate');
            }
            // Check if certificate already exists
            const existingCert = await models_1.Certificate.findOne({ enrollmentId });
            if (existingCert) {
                throw new error_types_1.ConflictError('Certificate already issued for this enrollment');
            }
            // Get course for batch info
            const course = enrollment.courseId;
            const batch = await models_1.CertificateBatch.findOne({ courseId: course._id })
                .sort({ createdAt: -1 });
            // Generate serial number
            const serialNumber = this.generateSerialNumber();
            const certificate = new models_1.Certificate({
                enrollmentId,
                studentId: enrollment.studentId,
                courseId: enrollment.courseId,
                serialNumber,
                issueDate: new Date(),
                batchId: batch?._id,
                googleDriveLink: '',
                status: 'issued'
            });
            await certificate.save();
            logger_1.logger.info(`Certificate generated: ${certificate._id}`);
            return certificate;
        }
        catch (error) {
            logger_1.logger.error('Generate certificate error', error);
            throw error;
        }
    }
    /**
     * Get certificate by ID
     */
    static async getCertificateById(certificateId) {
        try {
            const certificate = await models_1.Certificate.findById(certificateId)
                .populate('studentId', 'fullName email username')
                .populate('courseId', 'title level')
                .populate('batchId');
            if (!certificate) {
                throw new error_types_1.NotFoundError('Certificate not found');
            }
            return certificate;
        }
        catch (error) {
            logger_1.logger.error('Get certificate error', error);
            throw error;
        }
    }
    /**
     * Get student certificates
     */
    static async getStudentCertificates(studentId) {
        try {
            const certificates = await models_1.Certificate.find({ studentId })
                .populate('courseId', 'title level')
                .sort({ issueDate: -1 });
            return certificates;
        }
        catch (error) {
            logger_1.logger.error('Get student certificates error', error);
            throw error;
        }
    }
    /**
     * Get course certificates
     */
    static async getCourseCertificates(courseId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const total = await models_1.Certificate.countDocuments({ courseId });
            const certificates = await models_1.Certificate.find({ courseId })
                .populate('studentId', 'fullName email username')
                .skip(skip)
                .limit(limit)
                .sort({ issueDate: -1 });
            return {
                certificates,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Get course certificates error', error);
            throw error;
        }
    }
    /**
     * Verify certificate
     */
    static async verifyCertificate(serialNumber) {
        try {
            const certificate = await models_1.Certificate.findOne({ serialNumber })
                .populate('studentId', 'fullName')
                .populate('courseId', 'title level');
            if (!certificate) {
                throw new error_types_1.NotFoundError('Certificate not found');
            }
            return {
                valid: true,
                certificate: {
                    serialNumber: certificate.serialNumber,
                    studentName: certificate.studentId.fullName,
                    courseName: certificate.courseId.title,
                    issueDate: certificate.issueDate,
                    status: certificate.status
                }
            };
        }
        catch (error) {
            logger_1.logger.error('Verify certificate error', error);
            throw error;
        }
    }
    /**
     * Update certificate Google Drive link
     */
    static async updateGoogleDriveLink(certificateId, driveLink) {
        try {
            const certificate = await models_1.Certificate.findById(certificateId);
            if (!certificate) {
                throw new error_types_1.NotFoundError('Certificate not found');
            }
            certificate.googleDriveLink = driveLink;
            await certificate.save();
            logger_1.logger.info(`Certificate Google Drive link updated: ${certificateId}`);
            return certificate;
        }
        catch (error) {
            logger_1.logger.error('Update Google Drive link error', error);
            throw error;
        }
    }
    /**
     * Get batch certificates
     */
    static async getBatchCertificates(batchId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const total = await models_1.Certificate.countDocuments({ batchId });
            const certificates = await models_1.Certificate.find({ batchId })
                .populate('studentId', 'fullName email')
                .populate('courseId', 'title')
                .skip(skip)
                .limit(limit)
                .sort({ issueDate: -1 });
            return {
                certificates,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Get batch certificates error', error);
            throw error;
        }
    }
    /**
     * Generate serial number
     */
    static generateSerialNumber() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `CERT-${timestamp}-${random}`;
    }
}
exports.CertificateService = CertificateService;
exports.default = CertificateService;
//# sourceMappingURL=certificate.service.js.map