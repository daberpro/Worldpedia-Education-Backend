import { Transporter } from 'nodemailer';
/**
 * Email Configuration
 */
export declare const emailConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string | undefined;
        pass: string | undefined;
    };
    from: string;
    replyTo: string;
};
export declare const getEmailTransporter: () => Promise<Transporter>;
/**
 * Test email sending
 */
export declare const testEmailConnection: () => Promise<void>;
export default emailConfig;
//# sourceMappingURL=email.d.ts.map