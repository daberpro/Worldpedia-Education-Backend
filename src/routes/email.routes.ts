import { Router } from 'express';
import emailController from '../controllers/email.controller';

const router = Router();

/**
 * Public Routes
 */
// Send test email
router.post('/test', emailController.sendTestEmail.bind(emailController));

export default router;