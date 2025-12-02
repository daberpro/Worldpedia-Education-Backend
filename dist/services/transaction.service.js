"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const logger_1 = require("../utils/logger");
const payment_types_1 = require("../types/payment.types");
const invoice_generator_1 = require("../utils/invoice-generator");
const payment_validator_1 = require("../utils/payment-validator");
/**
 * In-memory transaction storage
 * In production, replace with database (MongoDB)
 */
const transactionStorage = new Map();
const invoiceStorage = new Map();
class TransactionService {
    /**
     * Record transaction
     */
    recordTransaction(transaction) {
        try {
            const data = {
                ...transaction,
                createdAt: new Date()
            };
            transactionStorage.set(transaction.transactionId, data);
            logger_1.logger.info(`✅ Transaction recorded: ${transaction.transactionId}`);
            return data;
        }
        catch (error) {
            logger_1.logger.error('Failed to record transaction:', error);
            throw error;
        }
    }
    /**
     * Get transaction by ID
     */
    getTransaction(transactionId) {
        return transactionStorage.get(transactionId) || null;
    }
    /**
     * Get user's transactions
     */
    getUserTransactions(userId, limit = 50) {
        try {
            const transactions = Array.from(transactionStorage.values())
                .filter((t) => t.userId === userId)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, limit)
                .map((t) => ({
                transactionId: t.transactionId,
                orderId: t.orderId,
                amount: t.amount,
                status: t.status,
                paymentMethod: t.paymentMethod,
                createdAt: t.createdAt,
                paidAt: t.paidAt
            }));
            return transactions;
        }
        catch (error) {
            logger_1.logger.error('Failed to get user transactions:', error);
            throw error;
        }
    }
    /**
     * Get transactions by status
     */
    getTransactionsByStatus(status, limit = 50) {
        try {
            const transactions = Array.from(transactionStorage.values())
                .filter((t) => t.status === status)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, limit)
                .map((t) => ({
                transactionId: t.transactionId,
                orderId: t.orderId,
                amount: t.amount,
                status: t.status,
                paymentMethod: t.paymentMethod,
                createdAt: t.createdAt,
                paidAt: t.paidAt
            }));
            return transactions;
        }
        catch (error) {
            logger_1.logger.error('Failed to get transactions by status:', error);
            throw error;
        }
    }
    /**
     * Create invoice
     */
    createInvoice(invoice) {
        try {
            const invoiceId = (0, payment_validator_1.generateInvoiceNumber)();
            const data = {
                ...invoice,
                invoiceId
            };
            invoiceStorage.set(invoiceId, data);
            logger_1.logger.info(`✅ Invoice created: ${invoiceId}`);
            return data;
        }
        catch (error) {
            logger_1.logger.error('Failed to create invoice:', error);
            throw error;
        }
    }
    /**
     * Get invoice by ID
     */
    getInvoice(invoiceId) {
        return invoiceStorage.get(invoiceId) || null;
    }
    /**
     * Get invoice as HTML
     */
    getInvoiceHTML(invoiceId) {
        const invoice = this.getInvoice(invoiceId);
        if (!invoice)
            return null;
        return (0, invoice_generator_1.generateInvoiceHTML)(invoice);
    }
    /**
     * Get invoice as plain text
     */
    getInvoiceText(invoiceId) {
        const invoice = this.getInvoice(invoiceId);
        if (!invoice)
            return null;
        return (0, invoice_generator_1.generateInvoiceText)(invoice);
    }
    /**
     * Get user's invoices
     */
    getUserInvoices(customerId, limit = 50) {
        try {
            const invoices = Array.from(invoiceStorage.values())
                .filter((i) => i.customerId === customerId)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, limit);
            return invoices;
        }
        catch (error) {
            logger_1.logger.error('Failed to get user invoices:', error);
            throw error;
        }
    }
    /**
     * Get statistics
     */
    getStatistics() {
        try {
            const transactions = Array.from(transactionStorage.values());
            const totalTransactions = transactions.length;
            const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
            const successfulTransactions = transactions.filter((t) => t.status === payment_types_1.PaymentStatus.SETTLEMENT || t.status === payment_types_1.PaymentStatus.CAPTURE).length;
            const pendingTransactions = transactions.filter((t) => t.status === payment_types_1.PaymentStatus.PENDING).length;
            const failedTransactions = transactions.filter((t) => t.status === payment_types_1.PaymentStatus.DENY ||
                t.status === payment_types_1.PaymentStatus.CANCEL ||
                t.status === payment_types_1.PaymentStatus.EXPIRE).length;
            return {
                totalTransactions,
                totalRevenue,
                successfulTransactions,
                pendingTransactions,
                failedTransactions,
                averageTransactionAmount: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
                successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get statistics:', error);
            throw error;
        }
    }
    /**
     * Update transaction status
     */
    updateTransactionStatus(transactionId, status) {
        try {
            const transaction = transactionStorage.get(transactionId);
            if (!transaction)
                return null;
            transaction.status = status;
            if (status === payment_types_1.PaymentStatus.SETTLEMENT ||
                status === payment_types_1.PaymentStatus.CAPTURE ||
                status === payment_types_1.PaymentStatus.REFUND) {
                transaction.paidAt = new Date();
            }
            transactionStorage.set(transactionId, transaction);
            logger_1.logger.info(`✅ Transaction status updated: ${transactionId} → ${status}`);
            return transaction;
        }
        catch (error) {
            logger_1.logger.error('Failed to update transaction status:', error);
            throw error;
        }
    }
}
exports.TransactionService = TransactionService;
exports.default = new TransactionService();
//# sourceMappingURL=transaction.service.js.map