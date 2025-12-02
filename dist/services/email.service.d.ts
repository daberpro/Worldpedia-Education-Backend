interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class EmailService {
    private transporter;
    private templateCache;
    init(): Promise<void>;
    private loadTemplate;
    private renderTemplate;
    sendEmail(payload: EmailPayload): Promise<string>;
    sendVerificationEmail(email: string, fullName: string, activationCode: string, verificationLink: string): Promise<string>;
    sendPasswordResetEmail(email: string, fullName: string, resetLink: string, resetToken: string): Promise<string>;
    sendEnrollmentConfirmationEmail(email: string, fullName: string, courseName: string, courseLevel: string, instructorName: string, duration: string, courseLink: string): Promise<string>;
    sendPaymentReceiptEmail(email: string, fullName: string, courseName: string, amount: string, transactionId: string, paymentMethod: string, paymentStatus: string, paymentDate: string): Promise<string>;
    sendCertificateIssuedEmail(email: string, fullName: string, courseName: string, serialNumber: string, issueDate: string, downloadLink: string): Promise<string>;
    sendWelcomeEmail(email: string, fullName: string, dashboardLink: string): Promise<string>;
    sendBulkEmail(recipients: string[], subject: string, html: string): Promise<never[]>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=email.service.d.ts.map