import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorization';

const router = Router();

// Public Routes
router.get('/methods', paymentController.getPaymentMethods.bind(paymentController));
router.post('/webhook', paymentController.handleWebhook.bind(paymentController));

// Authenticated Routes (User)
router.post('/create', authenticate, paymentController.createTransaction.bind(paymentController));
router.post('/verify', authenticate, paymentController.verifyPayment.bind(paymentController));
router.get('/status/:orderId', authenticate, paymentController.getPaymentStatus.bind(paymentController));
router.post('/cancel', authenticate, paymentController.cancelPayment.bind(paymentController));
router.post('/refund', authenticate, paymentController.refundPayment.bind(paymentController));
router.get('/history', authenticate, paymentController.getPaymentHistory.bind(paymentController));
router.get('/invoice/:invoiceId', authenticate, paymentController.getInvoice.bind(paymentController));

// Admin Routes
router.get('/admin/statistics', authenticate, authorize(['admin']), paymentController.getStatistics.bind(paymentController));
router.get('/admin/transactions', authenticate, authorize(['admin']), paymentController.getAllTransactions.bind(paymentController));
router.put('/admin/transactions/:id', authenticate, authorize(['admin']), paymentController.updateTransactionStatus.bind(paymentController));

export default router;