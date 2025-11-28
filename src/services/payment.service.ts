import { v4 as uuidv4 } from 'uuid';
import { snapClient, coreApi } from '../config/midtrans';
import { logger } from '../utils/logger';
import {
  TransactionRequest,
  CreatePaymentResponse,
  VerifyPaymentResponse,
  PaymentStatus
} from '../types/payment.types';
import {
  validateTransactionRequest,
  validateAmount,
  mapMidtransStatus
} from '../utils/payment-validator';

export class PaymentService {
  /**
   * Create new transaction with Midtrans
   */
  async createTransaction(request: TransactionRequest): Promise<CreatePaymentResponse> {
    try {
      // Validate request
      const validation = validateTransactionRequest(request);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Validate amount
      const amountValidation = validateAmount(request.amount);
      if (!amountValidation.valid) {
        throw new Error(amountValidation.error || 'Invalid amount');
      }

      // Generate IDs
      const transactionId = uuidv4();
      const orderId = `${request.userId}-${Date.now()}`;
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Prepare Snap parameter
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: request.amount
        },
        customer_details: {
          first_name: request.customerDetails.firstName,
          last_name: request.customerDetails.lastName,
          email: request.customerDetails.email,
          phone: request.customerDetails.phone,
          ...(request.customerDetails.address && {
            billing_address: {
              address: request.customerDetails.address,
              city: request.customerDetails.city,
              postal_code: request.customerDetails.postalCode,
              country_code: request.customerDetails.countryCode || 'ID'
            }
          })
        },
        item_details: request.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          merchant_name: item.merchantName
        })),
        ...(request.discount && {
          promo_code: {
            name: 'Discount',
            value: request.discount
          }
        }),
        metadata: {
          userId: request.userId,
          transactionId,
          description: request.description,
          ...request.metadata
        }
      };

      // Create transaction
      const result: any = await snapClient.createTransaction(parameter);

      logger.info(`✅ Transaction created: ${orderId}`, {
        transactionId,
        amount: request.amount
      });

      return {
        success: true,
        transactionId,
        orderId,
        amount: request.amount,
        snapToken: result.token,
        redirectUrl: result.redirect_url,
        expiresAt,
        message: 'Payment transaction created successfully'
      };
    } catch (error: any) {
      logger.error('Failed to create transaction:', error);
      throw error;
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(transactionId: string): Promise<VerifyPaymentResponse> {
    try {
      const result: any = await (coreApi as any).transaction.status(transactionId);

      const status = mapMidtransStatus(result.transaction_status, result.fraud_status);

      logger.info(`✅ Payment verified: ${transactionId}`, { status });

      return {
        success: true,
        transactionId: result.transaction_id,
        status,
        paidAt: result.settlement_time ? new Date(result.settlement_time) : undefined,
        paymentMethod: result.payment_type,
        amount: result.gross_amount,
        message: 'Payment verification successful'
      };
    } catch (error: any) {
      logger.error('Failed to verify payment:', error);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransactionDetails(transactionId: string): Promise<any> {
    try {
      const result: any = await (coreApi as any).transaction.status(transactionId);
      return result;
    } catch (error: any) {
      logger.error(`Failed to get transaction details for ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel transaction
   */
  async cancelTransaction(transactionId: string): Promise<void> {
    try {
      await (coreApi as any).transaction.cancel(transactionId);
      logger.info(`✅ Transaction cancelled: ${transactionId}`);
    } catch (error: any) {
      logger.error(`Failed to cancel transaction ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Expire transaction
   */
  async expireTransaction(transactionId: string): Promise<void> {
    try {
      await (coreApi as any).transaction.expire(transactionId);
      logger.info(`✅ Transaction expired: ${transactionId}`);
    } catch (error: any) {
      logger.error(`Failed to expire transaction ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async refundTransaction(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<any> {
    try {
      const parameter: any = {};

      if (amount) {
        parameter.refund_key = `refund-${transactionId}-${Date.now()}`;
        parameter.amount = amount;
      }

      const result: any = await (coreApi as any).transaction.refund(transactionId, parameter);

      logger.info(`✅ Refund processed: ${transactionId}`, {
        amount,
        reason
      });

      return result;
    } catch (error: any) {
      logger.error(`Failed to refund transaction ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Process webhook callback from Midtrans
   */
  async processWebhook(payload: any): Promise<{ success: boolean; status: PaymentStatus }> {
    try {
      const { transaction_id, transaction_status, fraud_status } = payload;

      const status = mapMidtransStatus(transaction_status, fraud_status);

      logger.info(`✅ Webhook processed: ${transaction_id}`, { status });

      return {
        success: true,
        status
      };
    } catch (error: any) {
      logger.error('Failed to process webhook:', error);
      throw error;
    }
  }

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods(): Record<string, any> {
    return {
      creditCard: {
        name: 'Credit/Debit Card',
        enabled: true,
        icon: 'credit-card',
        currencies: ['IDR', 'USD']
      },
      bankTransfer: {
        name: 'Bank Transfer',
        enabled: true,
        icon: 'bank',
        currencies: ['IDR'],
        banks: ['bca', 'bni', 'bri', 'mandiri']
      },
      eWallet: {
        name: 'E-Wallet',
        enabled: true,
        icon: 'wallet',
        currencies: ['IDR'],
        providers: ['gopay', 'ovo', 'dana', 'linkaja']
      },
      bnpl: {
        name: 'Buy Now Pay Later',
        enabled: true,
        icon: 'calendar',
        currencies: ['IDR'],
        providers: ['kredivo', 'akulaku']
      },
      echannel: {
        name: 'E-Channel (ATM)',
        enabled: true,
        icon: 'atm',
        currencies: ['IDR']
      }
    };
  }

  /**
   * Check if amount is eligible for payment
   */
  isPaymentEligible(amount: number): boolean {
    return amount >= 1000 && amount <= 999999999;
  }
}

export default new PaymentService();