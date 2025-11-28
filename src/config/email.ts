import nodemailer, { Transporter } from 'nodemailer';
import config from './env';

/**
 * Email Configuration
 */
export const emailConfig = {
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  },
  from: config.smtp.from,
  replyTo: config.smtp.from
};

/**
 * Create Nodemailer Transporter
 */
let transporter: Transporter | null = null;

export const getEmailTransporter = async (): Promise<Transporter> => {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);
    
    // Verify connection
    try {
      await transporter.verify();
      console.log('✅ Email transporter verified');
    } catch (error) {
      console.error('❌ Email transporter verification failed:', error);
      throw error;
    }
  }
  
  return transporter;
};

/**
 * Test email sending
 */
export const testEmailConnection = async (): Promise<void> => {
  try {
    const transporter = await getEmailTransporter();
    await transporter.sendMail({
      from: emailConfig.from,
      to: config.smtp.user, // Send to self for testing
      subject: 'Test Email - Worldpedia Education',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<p>This is a test email to verify SMTP configuration.</p>'
    });
    console.log('✅ Test email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    throw error;
  }
};

export default emailConfig;