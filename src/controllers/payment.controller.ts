import { Request, Response } from 'express';
import paymentService from '../services/payment.service';
import { logger } from '../utils/logger';
import { TransactionRequest } from '../types/payment.types';
import { successResponse, paginatedResponse } from '../utils';

export class PaymentController {
  async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const request: TransactionRequest = req.body;
      const userId = (req.user as any)?.userId;

      if (!userId) {
        res.status(401).json({ success: false, error: 'User not authenticated' });
        return;
      }

      request.userId = userId;
      const result = await paymentService.createTransaction(request);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Payment transaction created successfully'
      });
    } catch (error: any) {
      logger.error('Error creating transaction:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId } = req.body;
      if (!transactionId) {
        res.status(400).json({ success: false, error: 'Transaction ID is required' });
        return;
      }

      const result = await paymentService.verifyPayment(transactionId);
      res.status(200).json({ success: true, data: result, message: 'Payment verified successfully' });
    } catch (error: any) {
      logger.error('Error verifying payment:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const payment = await paymentService.getPaymentByOrderId(orderId);
      
      res.status(200).json(successResponse(payment));
    } catch (error: any) {
      logger.error('Error getting payment status:', error);
      res.status(404).json({ success: false, error: error.message });
    }
  }

  async cancelPayment(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId } = req.body;
      await paymentService.cancelTransaction(transactionId);
      res.status(200).json({ success: true, message: 'Payment cancelled successfully' });
    } catch (error: any) {
      logger.error('Error cancelling payment:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async refundPayment(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId, amount, reason } = req.body;
      const result = await paymentService.refundTransaction(transactionId, amount, reason);
      res.status(200).json({ success: true, data: result, message: 'Refund processed successfully' });
    } catch (error: any) {
      logger.error('Error processing refund:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      await paymentService.processWebhook(req.body);
      res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    } catch (error: any) {
      logger.error('Error processing webhook:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.userId;
      const { limit } = req.query;
      
      if (!userId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const history = await paymentService.getUserPayments(userId, parseInt(limit as string) || 50);
      res.status(200).json(successResponse(history));
    } catch (error: any) {
      logger.error('Error getting history:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceId } = req.params;
      // Implementasi sederhana untuk mengambil data invoice dari payment
      const payment = await paymentService.getPaymentById(invoiceId);
      res.status(200).json(successResponse(payment));
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  async getPaymentMethods(_req: Request, res: Response): Promise<void> {
    try {
      const methods = paymentService.getAvailablePaymentMethods();
      res.status(200).json(successResponse(methods));
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await paymentService.getPaymentStatistics();
      res.status(200).json(successResponse(stats));
    } catch (error: any) {
      logger.error('Error getting stats:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getAllTransactions(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { status } = req.query;

      const result = await paymentService.getAllTransactions(page, limit, status as string);
      res.status(200).json(paginatedResponse(result.transactions, result.total, result.page, result.limit));
    } catch (error: any) {
      logger.error('Error getting all transactions:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async updateTransactionStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        res.status(400).json({ success: false, error: 'Status is required' });
        return;
      }

      const result = await paymentService.updatePaymentStatus(id, status);
      res.status(200).json(successResponse(result, 'Transaction status updated'));
    } catch (error: any) {
      logger.error('Error updating transaction:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

export default new PaymentController();