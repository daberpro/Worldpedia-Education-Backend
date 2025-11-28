import emailQueue from '../config/queue';
import { logger } from '../utils/logger';
import { getEmailTransporter } from '../config/email';

/**
 * Email Queue Processor Service
 */
export class EmailQueueService {
  /**
   * Initialize queue processor
   */
  static async initializeProcessor(): Promise<void> {
    try {
      // Process email jobs
      emailQueue.process(async (job) => {
        try {
          const transporter = await getEmailTransporter();
          const mailOptions = {
            from: process.env.SMTP_FROM || 'noreply@worldpedia.com',
            ...job.data
          };

          const info = await transporter.sendMail(mailOptions);

          logger.info(`Email job ${job.id} processed successfully`, {
            messageId: info.messageId,
            to: job.data.to
          });

          return { success: true, messageId: info.messageId };
        } catch (error) {
          logger.error(`Email job ${job.id} failed`, error);
          throw error;
        }
      });

      // Handle job events
      emailQueue.on('completed', (job) => {
        logger.info(`✅ Email job completed: ${job.id}`, {
          to: job.data.to,
          subject: job.data.subject
        });
      });

      emailQueue.on('failed', (job, err) => {
        logger.error(`❌ Email job failed: ${job.id}`, {
          to: job.data.to,
          subject: job.data.subject,
          error: err.message
        });
      });

      emailQueue.on('error', (error) => {
        logger.error('❌ Queue error:', error);
      });

      logger.info('✅ Email queue processor initialized');
    } catch (error) {
      logger.error('Failed to initialize email queue processor', error);
      throw error;
    }
  }

  /**
   * Start queue
   */
  static async startQueue(): Promise<void> {
    try {
      await this.initializeProcessor();
      logger.info('✅ Email queue started');
    } catch (error) {
      logger.error('Failed to start email queue', error);
      throw error;
    }
  }

  /**
   * Close queue
   */
  static async closeQueue(): Promise<void> {
    try {
      await emailQueue.close();
      logger.info('✅ Email queue closed');
    } catch (error) {
      logger.error('Failed to close email queue', error);
      throw error;
    }
  }

  /**
   * Get pending emails
   */
  static async getPendingEmails(): Promise<any[]> {
    try {
      const jobs = await emailQueue.getWaiting();
      return jobs.map(job => ({
        id: job.id,
        to: job.data.to,
        subject: job.data.subject,
        status: 'pending',
        createdAt: job.timestamp
      }));
    } catch (error) {
      logger.error('Failed to get pending emails', error);
      throw error;
    }
  }

  /**
   * Get failed emails
   */
  static async getFailedEmails(): Promise<any[]> {
    try {
      const jobs = await emailQueue.getFailed();
      return jobs.map(job => ({
        id: job.id,
        to: job.data.to,
        subject: job.data.subject,
        status: 'failed',
        failedReason: job.failedReason,
        failedAttempts: (job as any).attemptsMade || 0,
        createdAt: job.timestamp
      }));
    } catch (error) {
      logger.error('Failed to get failed emails', error);
      throw error;
    }
  }
}

export default EmailQueueService;