import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * Public Routes (no authentication required)
 */

// Get available payment methods
router.get(
  '/methods',
  paymentController.getPaymentMethods.bind(paymentController)
);

// Webhook from Midtrans (no auth)
router.post(
  '/webhook',
  paymentController.handleWebhook.bind(paymentController)
);

/**
 * Authenticated Routes (authentication required)
 */

// Create payment transaction
router.post(
  '/create',
  authenticate,
  paymentController.createTransaction.bind(paymentController)
);

// Verify payment
router.post(
  '/verify',
  authenticate,
  paymentController.verifyPayment.bind(paymentController)
);

// Get payment status
router.get(
  '/status/:orderId',
  authenticate,
  paymentController.getPaymentStatus.bind(paymentController)
);

// Cancel payment
router.post(
  '/cancel',
  authenticate,
  paymentController.cancelPayment.bind(paymentController)
);

// Process refund
router.post(
  '/refund',
  authenticate,
  paymentController.refundPayment.bind(paymentController)
);

// Get payment history
router.get(
  '/history',
  authenticate,
  paymentController.getPaymentHistory.bind(paymentController)
);

// Get invoice
router.get(
  '/invoice/:invoiceId',
  authenticate,
  paymentController.getInvoice.bind(paymentController)
);

/**
 * Admin Routes
 */

// Get payment statistics
router.get(
  '/admin/statistics',
  authenticate,
  paymentController.getStatistics.bind(paymentController)
);

export default router;