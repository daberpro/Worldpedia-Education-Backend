import { Request, Response } from 'express';
import emailService from '../services/email.service';
import { successResponse, errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

export class EmailController {
  /**
   * Get queue statistics
   */
  async getQueueStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await emailService.getQueueStats();
      res.status(200).json(successResponse(stats, 'Queue statistics retrieved successfully'));
    } catch (error) {
      logger.error('Error getting queue stats:', error);
      res.status(500).json(errorResponse('Failed to get queue statistics'));
    }
  }

  /**
   * Get pending emails
   */
  async getPendingEmails(_req: Request, res: Response): Promise<void> {
    try {
      const pending = await emailService.getPendingEmails();
      res.status(200).json(successResponse(pending, 'Pending emails retrieved successfully'));
    } catch (error) {
      logger.error('Error getting pending emails:', error);
      res.status(500).json(errorResponse('Failed to get pending emails'));
    }
  }

  /**
   * Get failed emails
   */
  async getFailedEmails(_req: Request, res: Response): Promise<void> {
    try {
      const failed = await emailService.getFailedEmails();
      res.status(200).json(successResponse(failed, 'Failed emails retrieved successfully'));
    } catch (error) {
      logger.error('Error getting failed emails:', error);
      res.status(500).json(errorResponse('Failed to get failed emails'));
    }
  }

  /**
   * Retry failed emails
   */
  async retryFailedEmails(_req: Request, res: Response): Promise<void> {
    try {
      const count = await emailService.retryFailedEmails();
      res.status(200).json(successResponse({ retried: count }, `${count} failed emails retried successfully`));
    } catch (error) {
      logger.error('Error retrying failed emails:', error);
      res.status(500).json(errorResponse('Failed to retry failed emails'));
    }
  }

  /**
   * Clear queue
   */
  async clearQueue(_req: Request, res: Response): Promise<void> {
    try {
      await emailService.clearQueue();
      res.status(200).json(successResponse({}, 'Queue cleared successfully'));
    } catch (error) {
      logger.error('Error clearing queue:', error);
      res.status(500).json(errorResponse('Failed to clear queue'));
    }
  }

  /**
   * Send test email
   */
  async sendTestEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json(errorResponse('Email address is required'));
        return;
      }

      const messageId = await emailService.sendEmail({
        to: email,
        subject: 'Test Email - Worldpedia Education',
        html: '<p>This is a test email from Worldpedia Education platform.</p>',
        text: 'This is a test email from Worldpedia Education platform.'
      });

      res.status(200).json(successResponse({ messageId }, 'Test email sent successfully'));
    } catch (error) {
      logger.error('Error sending test email:', error);
      res.status(500).json(errorResponse('Failed to send test email'));
    }
  }
}

export default new EmailController();