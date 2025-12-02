"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Certificates
 *     description: Manajemen Sertifikat Kelulusan
 */
/**
 * @swagger
 * /certificates/verify/{serialNumber}:
 *   get:
 *     summary: Verifikasi sertifikat (Public)
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Sertifikat valid
 *       '404':
 *         description: Sertifikat tidak ditemukan
 */
router.get('/verify/:serialNumber', controllers_1.CertificateController.verifyCertificate);
/**
 * @swagger
 * /certificates/my:
 *   get:
 *     summary: Lihat sertifikat saya
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List sertifikat user
 */
router.get('/my', middleware_1.authenticate, controllers_1.CertificateController.getMyCertificates);
/**
 * @swagger
 * /certificates/{enrollmentId}:
 *   post:
 *     summary: Generate sertifikat setelah lulus
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Sertifikat berhasil diterbitkan
 */
router.post('/:enrollmentId', middleware_1.authenticate, controllers_1.CertificateController.generateCertificate);
// Routes lainnya tanpa dokumentasi Swagger (masih normal)
router.get('/:id', middleware_1.authenticate, controllers_1.CertificateController.getCertificateById);
router.get('/student/:studentId', middleware_1.authenticate, controllers_1.CertificateController.getStudentCertificates);
router.get('/course/:courseId', middleware_1.authenticate, controllers_1.CertificateController.getCourseCertificates);
router.get('/batch/:batchId', middleware_1.authenticate, controllers_1.CertificateController.getBatchCertificates);
router.patch('/:id/drive-link', middleware_1.authenticate, controllers_1.CertificateController.updateGoogleDriveLink);
router.post('/batch', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.CertificateController.createCertificateBatch);
exports.default = router;
//# sourceMappingURL=certificate.routes.js.map