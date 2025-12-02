"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: Manajemen Katalog Kursus
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Judul kursus
 *         description:
 *           type: string
 *           description: Deskripsi kursus
 *         level:
 *           type: string
 *           enum: [PAUD, TK, SD, SMP, SMA, UMUM]
 *           description: Tingkat yang dituju
 *         price:
 *           type: number
 *           description: Harga kursus (dalam satuan lokal)
 *         instructorName:
 *           type: string
 *           description: Nama pengajar/instruktur
 *         duration:
 *           type: number
 *           description: Durasi dalam minggu
 *         capacity:
 *           type: number
 *           description: Kapasitas peserta
 *         modules:
 *           type: array
 *           items:
 *             type: string
 *           description: Daftar nama modul
 *       example:
 *         title: "Mengenal Huruf untuk PAUD"
 *         description: "Kursus pengenalan huruf untuk anak usia dini."
 *         level: PAUD
 *         price: 0
 *         instructorName: "Budi Santoso"
 *         duration: 4
 *         capacity: 20
 *         modules:
 *           - "Pengenalan A-E"
 *           - "Pengenalan F-J"
 */
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Ambil semua kursus (Public)
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah item per halaman
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filter berdasarkan tingkat (SD, SMP, dll)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan judul
 *     responses:
 *       '200':
 *         description: Berhasil mengambil daftar kursus
 */
router.get('/', controllers_1.CourseController.getAllCourses);
/**
 * @swagger
 * /courses/search:
 *   get:
 *     summary: Cari kursus
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Hasil pencarian
 */
router.get('/search', controllers_1.CourseController.searchCourses);
/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Ambil detail kursus
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Detail kursus
 *       '404':
 *         description: Kursus tidak ditemukan
 */
router.get('/:id', controllers_1.CourseController.getCourseById);
/**
 * @swagger
 * /courses/{id}/stats:
 *   get:
 *     summary: Ambil statistik kursus
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Statistik kursus (enrollment, revenue, dll)
 */
router.get('/:id/stats', controllers_1.CourseController.getCourseStats);
/**
 * @swagger
 * /courses/{id}/enrollments:
 *   get:
 *     summary: Ambil daftar siswa terdaftar di kursus ini
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Daftar enrollment
 */
router.get('/:id/enrollments', controllers_1.CourseController.getCourseEnrollments);
/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Buat kursus baru (Admin/Instructor)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       '201':
 *         description: Kursus berhasil dibuat
 *       '401':
 *         description: Unauthorized
 */
router.post('/', middleware_1.authenticate, controllers_1.CourseController.createCourse);
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update kursus
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       '200':
 *         description: Kursus berhasil diupdate
 */
router.put('/:id', middleware_1.authenticate, controllers_1.CourseController.updateCourse);
/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Hapus kursus
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Kursus berhasil dihapus
 */
router.delete('/:id', middleware_1.authenticate, controllers_1.CourseController.deleteCourse);
exports.default = router;
//# sourceMappingURL=course.routes.js.map