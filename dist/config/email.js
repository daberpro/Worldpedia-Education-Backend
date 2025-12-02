"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailConnection = exports.getEmailTransporter = exports.emailConfig = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("./env"));
/**
 * Email Configuration
 */
exports.emailConfig = {
    host: env_1.default.smtp.host,
    port: env_1.default.smtp.port,
    secure: env_1.default.smtp.port === 465,
    auth: {
        user: env_1.default.smtp.user,
        pass: env_1.default.smtp.pass
    },
    from: env_1.default.smtp.from,
    replyTo: env_1.default.smtp.from
};
/**
 * Create Nodemailer Transporter
 */
let transporter = null;
const getEmailTransporter = async () => {
    if (!transporter) {
        transporter = nodemailer_1.default.createTransport(exports.emailConfig);
        // Verify connection
        try {
            await transporter.verify();
            console.log('✅ Email transporter verified');
        }
        catch (error) {
            console.error('❌ Email transporter verification failed:', error);
            throw error;
        }
    }
    return transporter;
};
exports.getEmailTransporter = getEmailTransporter;
/**
 * Test email sending
 */
const testEmailConnection = async () => {
    try {
        const transporter = await (0, exports.getEmailTransporter)();
        await transporter.sendMail({
            from: exports.emailConfig.from,
            to: env_1.default.smtp.user, // Send to self for testing
            subject: 'Test Email - Worldpedia Education',
            text: 'This is a test email to verify SMTP configuration.',
            html: '<p>This is a test email to verify SMTP configuration.</p>'
        });
        console.log('✅ Test email sent successfully');
    }
    catch (error) {
        console.error('❌ Failed to send test email:', error);
        throw error;
    }
};
exports.testEmailConnection = testEmailConnection;
exports.default = exports.emailConfig;
//# sourceMappingURL=email.js.map