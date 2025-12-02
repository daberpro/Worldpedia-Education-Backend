import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorization';

const router = Router();

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
router.get('/methods', paymentController.getPaymentMethods.bind(paymentController));

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
router.post('/create', authenticate, paymentController.createTransaction.bind(paymentController));

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
router.post('/webhook', paymentController.handleWebhook.bind(paymentController));

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
router.get('/history', authenticate, paymentController.getPaymentHistory.bind(paymentController));

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
router.get('/admin/transactions', authenticate, authorize(['admin']), paymentController.getAllTransactions.bind(paymentController));

// Route lainnya (tidak didokumentasikan di Swagger saat ini agar file tidak terlalu panjang)
router.post('/verify', authenticate, paymentController.verifyPayment.bind(paymentController));
router.get('/status/:orderId', authenticate, paymentController.getPaymentStatus.bind(paymentController));
router.post('/cancel', authenticate, paymentController.cancelPayment.bind(paymentController));
router.post('/refund', authenticate, paymentController.refundPayment.bind(paymentController));
router.get('/invoice/:invoiceId', authenticate, paymentController.getInvoice.bind(paymentController));
router.get('/admin/statistics', authenticate, authorize(['admin']), paymentController.getStatistics.bind(paymentController));
router.put('/admin/transactions/:id', authenticate, authorize(['admin']), paymentController.updateTransactionStatus.bind(paymentController));

export default router;