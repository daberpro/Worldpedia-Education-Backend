import { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { getEmailTransporter } from '../config/email';
import { emailQueue } from '../config/queue';
import { logger } from '../utils/logger';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  total: number;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private templateCache = new Map<string, handlebars.TemplateDelegate>();

  /**
   * Initialize Email Service
   */
  async init(): Promise<void> {
    try {
      this.transporter = await getEmailTransporter();
      logger.info('✅ Email service initialized');
    } catch (error) {
      logger.error('❌ Failed to initialize email service:', error);
      throw error;
    }
  }

  /**
   * Load and compile template
   */
  private async loadTemplate(templateName: string): Promise<handlebars.TemplateDelegate> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    try {
      const templatePath = path.join(__dirname, `../templates/email/${templateName}.template.html`);
      const content = await fs.readFile(templatePath, 'utf-8');
      const compiled = handlebars.compile(content);
      this.templateCache.set(templateName, compiled);
      return compiled;
    } catch (error) {
      logger.error(`Failed to load template ${templateName}:`, error);
      throw error;
    }
  }

  /**
   * Render template with data
   */
  private async renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
    try {
      const template = await this.loadTemplate(templateName);
      return template(data);
    } catch (error) {
      logger.error(`Failed to render template ${templateName}:`, error);
      throw error;
    }
  }

  /**
   * Send email immediately
   */
  async sendEmail(payload: EmailPayload): Promise<string> {
    try {
      if (!this.transporter) await this.init();
      
      const result = await this.transporter!.sendMail(payload);
      logger.info(`✅ Email sent to ${payload.to} (Message ID: ${result.messageId})`);
      return result.messageId;
    } catch (error) {
      logger.error(`❌ Failed to send email to ${payload.to}:`, error);
      throw error;
    }
  }

  /**
   * Queue email for delayed sending
   */
  async queueEmail(payload: EmailPayload, delayMs: number = 0): Promise<string> {
    try {
      const job = await emailQueue.add(payload, {
        delay: delayMs,
        jobId: `${payload.to}-${Date.now()}`
      });
      logger.info(`✅ Email queued to ${payload.to} (Job ID: ${job.id})`);
      return job.id as string;
    } catch (error) {
      logger.error(`❌ Failed to queue email to ${payload.to}:`, error);
      throw error;
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(
    email: string,
    fullName: string,
    activationCode: string,
    verificationLink: string
  ): Promise<string> {
    try {
      const html = await this.renderTemplate('verification', {
        fullName,
        activationCode,
        verificationLink
      });

      return await this.sendEmail({
        to: email,
        subject: 'Verify Your Email - Worldpedia Education',
        html
      });
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    fullName: string,
    resetLink: string,
    resetToken: string
  ): Promise<string> {
    try {
      const html = await this.renderTemplate('password-reset', {
        fullName,
        resetLink,
        resetToken
      });

      return await this.sendEmail({
        to: email,
        subject: 'Reset Your Password - Worldpedia Education',
        html
      });
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send enrollment confirmation email
   */
  async sendEnrollmentConfirmationEmail(
    email: string,
    fullName: string,
    courseName: string,
    courseLevel: string,
    instructorName: string,
    duration: string,
    courseLink: string
  ): Promise<string> {
    try {
      const html = await this.renderTemplate('enrollment-confirmation', {
        fullName,
        courseName,
        courseLevel,
        instructorName,
        duration,
        courseLink
      });

      return await this.queueEmail({
        to: email,
        subject: `Welcome to ${courseName} - Worldpedia Education`,
        html
      });
    } catch (error) {
      logger.error(`Failed to send enrollment confirmation email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send payment receipt email
   */
  async sendPaymentReceiptEmail(
    email: string,
    fullName: string,
    courseName: string,
    amount: string,
    transactionId: string,
    paymentMethod: string,
    paymentStatus: string,
    paymentDate: string
  ): Promise<string> {
    try {
      const html = await this.renderTemplate('payment-receipt', {
        fullName,
        courseName,
        amount,
        transactionId,
        paymentMethod,
        paymentStatus,
        paymentDate
      });

      return await this.sendEmail({
        to: email,
        subject: 'Payment Receipt - Worldpedia Education',
        html
      });
    } catch (error) {
      logger.error(`Failed to send payment receipt email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send certificate issued email
   */
  async sendCertificateIssuedEmail(
    email: string,
    fullName: string,
    courseName: string,
    serialNumber: string,
    issueDate: string,
    downloadLink: string
  ): Promise<string> {
    try {
      const html = await this.renderTemplate('certificate-issued', {
        fullName,
        courseName,
        serialNumber,
        issueDate,
        downloadLink
      });

      return await this.sendEmail({
        to: email,
        subject: `Congratulations! Your Certificate - ${courseName}`,
        html
      });
    } catch (error) {
      logger.error(`Failed to send certificate issued email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    email: string,
    fullName: string,
    dashboardLink: string
  ): Promise<string> {
    try {
      const html = await this.renderTemplate('welcome', {
        fullName,
        dashboardLink
      });

      return await this.queueEmail({
        to: email,
        subject: 'Welcome to Worldpedia Education!',
        html
      }, 1000);
    } catch (error) {
      logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string
  ): Promise<string[]> {
    try {
      const jobIds: string[] = [];
      for (const email of recipients) {
        const jobId = await this.queueEmail({ to: email, subject, html });
        jobIds.push(jobId);
      }
      logger.info(`✅ Bulk email queued for ${recipients.length} recipients`);
      return jobIds;
    } catch (error) {
      logger.error('Failed to send bulk emails:', error);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<QueueStats> {
    try {
      const counts = await emailQueue.getJobCounts();
      return {
        waiting: counts.waiting,
        active: counts.active,
        completed: counts.completed,
        failed: counts.failed,
        delayed: counts.delayed,
        total: counts.waiting + counts.active + counts.completed + counts.failed + counts.delayed
      };
    } catch (error) {
      logger.error('Failed to get queue stats:', error);
      throw error;
    }
  }

  /**
   * Get pending emails
   */
  async getPendingEmails(): Promise<any[]> {
    try {
      const jobs = await emailQueue.getWaiting(0, -1);
      return jobs.map(job => ({
        id: job.id,
        email: job.data.to,
        subject: job.data.subject,
        timestamp: job.timestamp,
        attempts: job.attemptsMade
      }));
    } catch (error) {
      logger.error('Failed to get pending emails:', error);
      throw error;
    }
  }

  /**
   * Get failed emails
   */
  async getFailedEmails(): Promise<any[]> {
    try {
      const jobs = await emailQueue.getFailed(0, -1);
      return jobs.map(job => ({
        id: job.id,
        email: job.data.to,
        subject: job.data.subject,
        failedReason: job.failedReason,
        timestamp: job.timestamp,
        attempts: job.attemptsMade || 0
      }));
    } catch (error) {
      logger.error('Failed to get failed emails:', error);
      throw error;
    }
  }

  /**
   * Retry failed emails
   */
  async retryFailedEmails(): Promise<number> {
    try {
      const failedJobs = await emailQueue.getFailed(0, -1);
      let retried = 0;
      for (const job of failedJobs) {
        await job.retry();
        retried++;
      }
      logger.info(`✅ Retried ${retried} failed emails`);
      return retried;
    } catch (error) {
      logger.error('Failed to retry failed emails:', error);
      throw error;
    }
  }

  /**
   * Clear queue
   */
  async clearQueue(): Promise<void> {
    try {
      await emailQueue.clean(0, 'completed');
      await emailQueue.clean(0, 'failed');
      logger.info('✅ Queue cleared');
    } catch (error) {
      logger.error('Failed to clear queue:', error);
      throw error;
    }
  }
}

export default new EmailService();