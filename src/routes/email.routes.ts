import { Router } from 'express';
import emailController from '../controllers/email.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorization';

const router = Router();

/**
 * Public Routes
 */
// Send test email
router.post('/test', emailController.sendTestEmail.bind(emailController));

/**
 * Admin-only Routes
 */
// Get queue statistics
router.get('/queue/stats', authenticate, authorize(['admin']), emailController.getQueueStats.bind(emailController));

// Get pending emails
router.get('/pending', authenticate, authorize(['admin']), emailController.getPendingEmails.bind(emailController));

// Get failed emails
router.get('/failed', authenticate, authorize(['admin']), emailController.getFailedEmails.bind(emailController));

// Retry failed emails
router.post('/retry-failed', authenticate, authorize(['admin']), emailController.retryFailedEmails.bind(emailController));

// Clear queue
router.post('/queue/clear', authenticate, authorize(['admin']), emailController.clearQueue.bind(emailController));

export default router;