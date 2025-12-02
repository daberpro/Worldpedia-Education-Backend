"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
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
router.post('/', middleware_1.authenticate, controllers_1.EnrollmentController.createEnrollment);
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
router.get('/my', middleware_1.authenticate, controllers_1.EnrollmentController.getMyEnrollments);
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
router.get('/admin/list', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.EnrollmentController.getAllEnrollments);
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
router.get('/:id', middleware_1.authenticate, controllers_1.EnrollmentController.getEnrollmentById);
// Routes without JSDoc (kehilangan dokumentasi tidak fatal)
// Jika ingin didokumentasikan, ikuti pola di atas
router.get('/student/:studentId', middleware_1.authenticate, controllers_1.EnrollmentController.getStudentEnrollments);
router.get('/summary/:studentId', middleware_1.authenticate, controllers_1.EnrollmentController.getProgressSummary);
router.patch('/:id/status', middleware_1.authenticate, controllers_1.EnrollmentController.updateEnrollmentStatus);
router.patch('/:id/progress', middleware_1.authenticate, controllers_1.EnrollmentController.updateProgress);
router.delete('/:id', middleware_1.authenticate, controllers_1.EnrollmentController.cancelEnrollment);
exports.default = router;
//# sourceMappingURL=enrollment.routes.js.map