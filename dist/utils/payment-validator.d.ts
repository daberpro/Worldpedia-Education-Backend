import { PaymentStatus, TransactionRequest } from '../types/payment.types';
/**
 * Validate transaction amount
 * Min: 1000 IDR, Max: 999,999,999 IDR
 */
export declare const validateAmount: (amount: number) => {
    valid: boolean;
    error?: string;
};
/**
 * Validate email format
 */
export declare const validateEmail: (email: string) => boolean;
/**
 * Validate phone number format
 */
export declare const validatePhoneNumber: (phone: string) => boolean;
/**
 * Comprehensive transaction request validation
 */
export declare const validateTransactionRequest: (request: TransactionRequest) => {
    valid: boolean;
    errors: string[];
};
/**
 * Verify webhook signature from Midtrans
 */
export declare const verifyWebhookSignature: (transactionId: string, statusCode: string, grossAmount: string, serverKey: string, signatureKey: string) => boolean;
/**
 * Map Midtrans status to PaymentStatus enum
 */
export declare const mapMidtransStatus: (midtransStatus: string, fraudStatus?: string) => PaymentStatus;
/**
 * Generate unique invoice number
 */
export declare const generateInvoiceNumber: () => string;
/**
 * Format currency to Indonesian Rupiah
 */
export declare const formatCurrency: (amount: number) => string;
/**
 * Validate discount
 */
export declare const validateDiscount: (discount: number, amount: number) => {
    valid: boolean;
    error?: string;
};
/**
 * Calculate tax rate (default 10% for Indonesia)
 */
export declare const calculateTaxRate: (subtotal: number, taxRate?: number) => number;
/**
 * Get status color for UI display
 */
export declare const getStatusColor: (status: PaymentStatus) => string;
//# sourceMappingURL=payment-validator.d.ts.map