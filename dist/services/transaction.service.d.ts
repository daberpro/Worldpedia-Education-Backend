import { TransactionData, InvoiceData, PaymentStatus, PaymentHistory, PaymentStatistics } from '../types/payment.types';
export declare class TransactionService {
    /**
     * Record transaction
     */
    recordTransaction(transaction: Omit<TransactionData, 'createdAt'>): TransactionData;
    /**
     * Get transaction by ID
     */
    getTransaction(transactionId: string): TransactionData | null;
    /**
     * Get user's transactions
     */
    getUserTransactions(userId: string, limit?: number): PaymentHistory[];
    /**
     * Get transactions by status
     */
    getTransactionsByStatus(status: PaymentStatus, limit?: number): PaymentHistory[];
    /**
     * Create invoice
     */
    createInvoice(invoice: Omit<InvoiceData, 'invoiceId'>): InvoiceData;
    /**
     * Get invoice by ID
     */
    getInvoice(invoiceId: string): InvoiceData | null;
    /**
     * Get invoice as HTML
     */
    getInvoiceHTML(invoiceId: string): string | null;
    /**
     * Get invoice as plain text
     */
    getInvoiceText(invoiceId: string): string | null;
    /**
     * Get user's invoices
     */
    getUserInvoices(customerId: string, limit?: number): InvoiceData[];
    /**
     * Get statistics
     */
    getStatistics(): PaymentStatistics;
    /**
     * Update transaction status
     */
    updateTransactionStatus(transactionId: string, status: PaymentStatus): TransactionData | null;
}
declare const _default: TransactionService;
export default _default;
//# sourceMappingURL=transaction.service.d.ts.map