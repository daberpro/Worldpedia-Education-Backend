"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const email_1 = require("../config/email");
const logger_1 = require("../utils/logger");
class EmailService {
    constructor() {
        this.transporter = null;
        this.templateCache = new Map();
    }
    async init() {
        if (!this.transporter) {
            this.transporter = await (0, email_1.getEmailTransporter)();
            logger_1.logger.info('✅ Email service initialized (Direct Mode)');
        }
    }
    async loadTemplate(templateName) {
        if (this.templateCache.has(templateName)) {
            return this.templateCache.get(templateName);
        }
        try {
            const templatePath = path_1.default.join(__dirname, `../templates/email/${templateName}.template.html`);
            const content = await promises_1.default.readFile(templatePath, 'utf-8');
            const compiled = handlebars_1.default.compile(content);
            this.templateCache.set(templateName, compiled);
            return compiled;
        }
        catch (error) {
            logger_1.logger.error(`Failed to load template ${templateName}:`, error);
            throw error;
        }
    }
    async renderTemplate(templateName, data) {
        const template = await this.loadTemplate(templateName);
        return template(data);
    }
    // Method utama untuk kirim email langsung
    async sendEmail(payload) {
        try {
            await this.init();
            const result = await this.transporter.sendMail(payload);
            logger_1.logger.info(`✅ Email sent to ${payload.to} (Message ID: ${result.messageId})`);
            return result.messageId;
        }
        catch (error) {
            logger_1.logger.error(`❌ Failed to send email to ${payload.to}:`, error);
            // Jangan throw error agar flow aplikasi utama (misal register) tidak gagal cuma karena email gagal
            return '';
        }
    }
    // --- Wrapper Methods (Semuanya panggil sendEmail langsung) ---
    async sendVerificationEmail(email, fullName, activationCode, verificationLink) {
        const html = await this.renderTemplate('verification', { fullName, activationCode, verificationLink });
        // Tidak perlu await jika ingin user tidak menunggu email terkirim
        this.sendEmail({ to: email, subject: 'Verify Your Email', html });
        return 'Email sending started';
    }
    async sendPasswordResetEmail(email, fullName, resetLink, resetToken) {
        const html = await this.renderTemplate('password-reset', { fullName, resetLink, resetToken });
        await this.sendEmail({ to: email, subject: 'Reset Your Password', html });
        return 'Email sent';
    }
    async sendEnrollmentConfirmationEmail(email, fullName, courseName, courseLevel, instructorName, duration, courseLink) {
        const html = await this.renderTemplate('enrollment-confirmation', { fullName, courseName, courseLevel, instructorName, duration, courseLink });
        this.sendEmail({ to: email, subject: `Welcome to ${courseName}`, html }); // Fire and forget
        return 'Email sending started';
    }
    async sendPaymentReceiptEmail(email, fullName, courseName, amount, transactionId, paymentMethod, paymentStatus, paymentDate) {
        const html = await this.renderTemplate('payment-receipt', { fullName, courseName, amount, transactionId, paymentMethod, paymentStatus, paymentDate });
        this.sendEmail({ to: email, subject: 'Payment Receipt', html });
        return 'Email sending started';
    }
    async sendCertificateIssuedEmail(email, fullName, courseName, serialNumber, issueDate, downloadLink) {
        const html = await this.renderTemplate('certificate-issued', { fullName, courseName, serialNumber, issueDate, downloadLink });
        this.sendEmail({ to: email, subject: `Congratulations! Your Certificate`, html });
        return 'Email sending started';
    }
    async sendWelcomeEmail(email, fullName, dashboardLink) {
        const html = await this.renderTemplate('welcome', { fullName, dashboardLink });
        this.sendEmail({ to: email, subject: 'Welcome to Worldpedia Education!', html });
        return 'Email sending started';
    }
    // Fitur ini mungkin akan lemot tanpa Redis, tapi tetap bisa jalan untuk jumlah kecil
    async sendBulkEmail(recipients, subject, html) {
        logger_1.logger.info(`Starting bulk email to ${recipients.length} recipients...`);
        // Kirim satu per satu secara paralel tapi tanpa memblokir proses utama
        recipients.forEach(email => {
            this.sendEmail({ to: email, subject, html });
        });
        return [];
    }
}
exports.EmailService = EmailService;
exports.default = new EmailService();
//# sourceMappingURL=email.service.js.map