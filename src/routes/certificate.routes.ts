import { Router } from 'express';
import { CertificateController } from '../controllers';
import { authenticate, authorize } from '../middleware';

const router = Router();

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
router.get('/verify/:serialNumber', CertificateController.verifyCertificate);

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
router.get('/my', authenticate, CertificateController.getMyCertificates);

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
router.post('/:enrollmentId', authenticate, CertificateController.generateCertificate);

// Routes lainnya tanpa dokumentasi Swagger (masih normal)
router.get('/:id', authenticate, CertificateController.getCertificateById);
router.get('/student/:studentId', authenticate, CertificateController.getStudentCertificates);
router.get('/course/:courseId', authenticate, CertificateController.getCourseCertificates);
router.get('/batch/:batchId', authenticate, CertificateController.getBatchCertificates);
router.patch('/:id/drive-link', authenticate, CertificateController.updateGoogleDriveLink);
router.post('/batch', authenticate, authorize(['admin']), CertificateController.createCertificateBatch);

export default router;