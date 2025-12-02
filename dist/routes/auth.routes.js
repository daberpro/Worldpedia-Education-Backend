"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: API Autentikasi Pengguna
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Mendaftarkan pengguna baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               fullName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 12
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       '201':
 *         description: User berhasil didaftarkan
 *       '400':
 *         description: Validasi gagal atau user sudah ada
 */
router.post("/register", controllers_1.AuthController.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usernameOrEmail
 *               - password
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       '401':
 *         description: Kredensial salah
 */
router.post("/login", controllers_1.AuthController.login);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Token berhasil diperbarui
 *       '401':
 *         description: Refresh token tidak valid
 */
router.post("/refresh", controllers_1.AuthController.refreshToken);
/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verifikasi Email dengan Kode
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - activationCode
 *             properties:
 *               email:
 *                 type: string
 *               activationCode:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Email berhasil diverifikasi
 *       '400':
 *         description: Kode salah atau kadaluarsa
 */
router.post("/verify-email", controllers_1.AuthController.verifyEmail);
/**
 * @swagger
 * /auth/resend-code:
 *   post:
 *     summary: Kirim Ulang Kode Verifikasi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Kode verifikasi dikirim ulang
 *       '404':
 *         description: Email tidak ditemukan
 */
router.post("/resend-code", controllers_1.AuthController.resendVerificationCode);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request Reset Password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Link reset password dikirim
 */
router.post("/forgot-password", controllers_1.AuthController.requestPasswordReset);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset Password dengan Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password berhasil diubah
 */
router.post("/reset-password", controllers_1.AuthController.resetPassword);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout User
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Berhasil logout
 *       '401':
 *         description: Tidak terautentikasi
 */
router.post("/logout", middleware_1.authenticate, controllers_1.AuthController.logout);
/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Ganti Password (Login required)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password berhasil diganti
 */
router.post("/change-password", middleware_1.authenticate, controllers_1.AuthController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map