"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const auth_1 = require("../middleware/auth");
const authorization_1 = require("../middleware/authorization");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Manajemen Pembayaran & Transaksi Midtrans
 */
/**
 * @swagger
 * /payments/methods:
 *   get:
 *     summary: Dapatkan daftar metode pembayaran yang tersedia
 *     tags: [Payments]
 *     responses:
 *       '200':
 *         description: List metode pembayaran
 */
router.get('/methods', payment_controller_1.default.getPaymentMethods.bind(payment_controller_1.default));
/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: Buat transaksi pembayaran baru
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - customerDetails
 *               - items
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Jumlah total pembayaran
 *               customerDetails:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phone:
 *                     type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - name
 *                     - price
 *                     - quantity
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *     responses:
 *       '201':
 *         description: Transaksi dibuat, mengembalikan Snap Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 snapToken:
 *                   type: string
 *                 redirectUrl:
 *                   type: string
 */
router.post('/create', auth_1.authenticate, payment_controller_1.default.createTransaction.bind(payment_controller_1.default));
/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Webhook endpoint untuk notifikasi Midtrans
 *     tags: [Payments]
 *     responses:
 *       '200':
 *         description: Webhook processed
 */
router.post('/webhook', payment_controller_1.default.handleWebhook.bind(payment_controller_1.default));
/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Riwayat transaksi user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List riwayat transaksi
 */
router.get('/history', auth_1.authenticate, payment_controller_1.default.getPaymentHistory.bind(payment_controller_1.default));
/**
 * @swagger
 * /payments/admin/transactions:
 *   get:
 *     summary: Admin lihat semua transaksi
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter status transaksi
 *     responses:
 *       '200':
 *         description: Data semua transaksi
 */
router.get('/admin/transactions', auth_1.authenticate, (0, authorization_1.authorize)(['admin']), payment_controller_1.default.getAllTransactions.bind(payment_controller_1.default));
// Route lainnya (tidak didokumentasikan di Swagger saat ini agar file tidak terlalu panjang)
router.post('/verify', auth_1.authenticate, payment_controller_1.default.verifyPayment.bind(payment_controller_1.default));
router.get('/status/:orderId', auth_1.authenticate, payment_controller_1.default.getPaymentStatus.bind(payment_controller_1.default));
router.post('/cancel', auth_1.authenticate, payment_controller_1.default.cancelPayment.bind(payment_controller_1.default));
router.post('/refund', auth_1.authenticate, payment_controller_1.default.refundPayment.bind(payment_controller_1.default));
router.get('/invoice/:invoiceId', auth_1.authenticate, payment_controller_1.default.getInvoice.bind(payment_controller_1.default));
router.get('/admin/statistics', auth_1.authenticate, (0, authorization_1.authorize)(['admin']), payment_controller_1.default.getStatistics.bind(payment_controller_1.default));
router.put('/admin/transactions/:id', auth_1.authenticate, (0, authorization_1.authorize)(['admin']), payment_controller_1.default.updateTransactionStatus.bind(payment_controller_1.default));
exports.default = router;
//# sourceMappingURL=payment.routes.js.map