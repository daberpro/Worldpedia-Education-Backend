import { logger } from '../utils/logger';
import {
  TransactionData,
  InvoiceData,
  PaymentStatus,
  PaymentHistory,
  PaymentStatistics
} from '../types/payment.types';
import { generateInvoiceHTML, generateInvoiceText } from '../utils/invoice-generator';
import { generateInvoiceNumber } from '../utils/payment-validator';

/**
 * In-memory transaction storage
 * In production, replace with database (MongoDB)
 */
const transactionStorage = new Map<string, TransactionData>();
const invoiceStorage = new Map<string, InvoiceData>();

export class TransactionService {
  /**
   * Record transaction
   */
  recordTransaction(transaction: Omit<TransactionData, 'createdAt'>): TransactionData {
    try {
      const data: TransactionData = {
        ...transaction,
        createdAt: new Date()
      };

      transactionStorage.set(transaction.transactionId, data);
      logger.info(`✅ Transaction recorded: ${transaction.transactionId}`);

      return data;
    } catch (error: any) {
      logger.error('Failed to record transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  getTransaction(transactionId: string): TransactionData | null {
    return transactionStorage.get(transactionId) || null;
  }

  /**
   * Get user's transactions
   */
  getUserTransactions(userId: string, limit: number = 50): PaymentHistory[] {
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
    } catch (error: any) {
      logger.error('Failed to get user transactions:', error);
      throw error;
    }
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status: PaymentStatus, limit: number = 50): PaymentHistory[] {
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
    } catch (error: any) {
      logger.error('Failed to get transactions by status:', error);
      throw error;
    }
  }

  /**
   * Create invoice
   */
  createInvoice(invoice: Omit<InvoiceData, 'invoiceId'>): InvoiceData {
    try {
      const invoiceId = generateInvoiceNumber();
      const data: InvoiceData = {
        ...invoice,
        invoiceId
      };

      invoiceStorage.set(invoiceId, data);
      logger.info(`✅ Invoice created: ${invoiceId}`);

      return data;
    } catch (error: any) {
      logger.error('Failed to create invoice:', error);
      throw error;
    }
  }

  /**
   * Get invoice by ID
   */
  getInvoice(invoiceId: string): InvoiceData | null {
    return invoiceStorage.get(invoiceId) || null;
  }

  /**
   * Get invoice as HTML
   */
  getInvoiceHTML(invoiceId: string): string | null {
    const invoice = this.getInvoice(invoiceId);
    if (!invoice) return null;

    return generateInvoiceHTML(invoice);
  }

  /**
   * Get invoice as plain text
   */
  getInvoiceText(invoiceId: string): string | null {
    const invoice = this.getInvoice(invoiceId);
    if (!invoice) return null;

    return generateInvoiceText(invoice);
  }

  /**
   * Get user's invoices
   */
  getUserInvoices(customerId: string, limit: number = 50): InvoiceData[] {
    try {
      const invoices = Array.from(invoiceStorage.values())
        .filter((i) => i.customerId === customerId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);

      return invoices;
    } catch (error: any) {
      logger.error('Failed to get user invoices:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): PaymentStatistics {
    try {
      const transactions = Array.from(transactionStorage.values());

      const totalTransactions = transactions.length;
      const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
      const successfulTransactions = transactions.filter(
        (t) => t.status === PaymentStatus.SETTLEMENT || t.status === PaymentStatus.CAPTURE
      ).length;
      const pendingTransactions = transactions.filter((t) => t.status === PaymentStatus.PENDING).length;
      const failedTransactions = transactions.filter(
        (t) =>
          t.status === PaymentStatus.DENY ||
          t.status === PaymentStatus.CANCEL ||
          t.status === PaymentStatus.EXPIRE
      ).length;

      return {
        totalTransactions,
        totalRevenue,
        successfulTransactions,
        pendingTransactions,
        failedTransactions,
        averageTransactionAmount: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
        successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0
      };
    } catch (error: any) {
      logger.error('Failed to get statistics:', error);
      throw error;
    }
  }

  /**
   * Update transaction status
   */
  updateTransactionStatus(transactionId: string, status: PaymentStatus): TransactionData | null {
    try {
      const transaction = transactionStorage.get(transactionId);
      if (!transaction) return null;

      transaction.status = status;
      if (
        status === PaymentStatus.SETTLEMENT ||
        status === PaymentStatus.CAPTURE ||
        status === PaymentStatus.REFUND
      ) {
        transaction.paidAt = new Date();
      }

      transactionStorage.set(transactionId, transaction);
      logger.info(`✅ Transaction status updated: ${transactionId} → ${status}`);

      return transaction;
    } catch (error: any) {
      logger.error('Failed to update transaction status:', error);
      throw error;
    }
  }
}

export default new TransactionService();