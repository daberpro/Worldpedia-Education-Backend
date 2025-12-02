import { Router } from 'express';
import { EnrollmentController } from '../controllers';
import { authenticate, authorize } from '../middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Enrollments
 *     description: Manajemen Pendaftaran Siswa
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Daftar ke kursus (User)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Berhasil mendaftar (Pending Payment)
 *       '409':
 *         description: User sudah terdaftar
 */
router.post('/', authenticate, EnrollmentController.createEnrollment);

/**
 * @swagger
 * /enrollments/my:
 *   get:
 *     summary: Ambil kursus saya (Student)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, pending_payment]
 *         description: Filter status pendaftaran
 *     responses:
 *       '200':
 *         description: Daftar kursus user saat ini
 */
router.get('/my', authenticate, EnrollmentController.getMyEnrollments);

/**
 * @swagger
 * /enrollments/admin/list:
 *   get:
 *     summary: Ambil SEMUA enrollment (Admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List semua pendaftaran global
 *       '403':
 *         description: Hanya admin
 */
router.get('/admin/list', authenticate, authorize(['admin']), EnrollmentController.getAllEnrollments);

/**
 * @swagger
 * /enrollments/{id}:
 *   get:
 *     summary: Detail enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enrollment
 *     responses:
 *       '200':
 *         description: Detail data pendaftaran
 *       '404':
 *         description: Enrollment tidak ditemukan
 */
router.get('/:id', authenticate, EnrollmentController.getEnrollmentById);

// Routes without JSDoc (kehilangan dokumentasi tidak fatal)
// Jika ingin didokumentasikan, ikuti pola di atas
router.get('/student/:studentId', authenticate, EnrollmentController.getStudentEnrollments);
router.get('/summary/:studentId', authenticate, EnrollmentController.getProgressSummary);
router.patch('/:id/status', authenticate, EnrollmentController.updateEnrollmentStatus);
router.patch('/:id/progress', authenticate, EnrollmentController.updateProgress);
router.delete('/:id', authenticate, EnrollmentController.cancelEnrollment);

export default router;