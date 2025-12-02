import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { snapClient, coreApi } from "../config/midtrans";
import config from "../config/env";
import { logger } from "../utils/logger";
import { Payment, Enrollment } from "../models";
import {
  TransactionRequest,
  CreatePaymentResponse,
  VerifyPaymentResponse,
  PaymentStatus,
} from "../types/payment.types";
import {
  validateTransactionRequest,
  validateAmount,
  mapMidtransStatus,
  verifyWebhookSignature,
} from "../utils/payment-validator";
import { NotFoundError, ValidationError } from "../types/error.types";

export class PaymentService {
  async createTransaction(
    request: TransactionRequest
  ): Promise<CreatePaymentResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const validation = validateTransactionRequest(request);
      if (!validation.valid) {
        throw new ValidationError(
          `Validation failed: ${validation.errors.join(", ")}`
        );
      }

      const amountValidation = validateAmount(request.amount);
      if (!amountValidation.valid) {
        throw new ValidationError(amountValidation.error || "Invalid amount");
      }

      const transactionId = uuidv4();
      const orderId = `${request.userId}-${Date.now()}`;
      const enrollmentId = request.metadata?.enrollmentId;

      if (!enrollmentId) {
        throw new ValidationError("Enrollment ID is required in metadata");
      }

      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: request.amount,
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
              country_code: request.customerDetails.countryCode || "ID",
            },
          }),
        },
        item_details: request.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          merchant_name: item.merchantName,
        })),
        ...(request.discount && {
          promo_code: {
            name: "Discount",
            value: request.discount,
          },
        }),
        metadata: {
          userId: request.userId,
          enrollmentId,
          transactionId,
          description: request.description,
          ...request.metadata,
        },
      };

      const midtransResult: any = await snapClient.createTransaction(parameter);

      const payment = new Payment({
        transactionId,
        orderId,
        userId: request.userId,
        enrollmentId,
        amount: request.amount,
        status: PaymentStatus.PENDING,
        paymentMethod: "unknown",
        snapToken: midtransResult.token,
        redirectUrl: midtransResult.redirect_url,
        createdAt: new Date(),
      });

      await payment.save({ session });

      await session.commitTransaction();
      logger.info(`Transaction created: ${orderId}`);

      return {
        success: true,
        transactionId,
        orderId,
        amount: request.amount,
        snapToken: midtransResult.token,
        redirectUrl: midtransResult.redirect_url,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        message: "Payment transaction created successfully",
      };
    } catch (error: any) {
      await session.abortTransaction();
      logger.error("Failed to create transaction:", error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async verifyPayment(transactionId: string): Promise<VerifyPaymentResponse> {
    try {
      const result: any = await (coreApi as any).transaction.status(
        transactionId
      );
      const status = mapMidtransStatus(
        result.transaction_status,
        result.fraud_status
      );

      const payment = await Payment.findOne({
        $or: [{ transactionId }, { orderId: transactionId }],
      });

      if (payment && payment.status !== status) {
        payment.status = status;
        payment.paymentMethod = result.payment_type || payment.paymentMethod;

        if (
          status === PaymentStatus.SETTLEMENT ||
          status === PaymentStatus.CAPTURE
        ) {
          payment.paidAt = result.settlement_time
            ? new Date(result.settlement_time)
            : new Date();
          await Enrollment.findByIdAndUpdate(payment.enrollmentId, {
            status: "active",
            progress: 0,
          });
        } else if (
          status === PaymentStatus.CANCEL ||
          status === PaymentStatus.EXPIRE
        ) {
          await Enrollment.findByIdAndUpdate(payment.enrollmentId, {
            status: "cancelled",
          });
        }

        await payment.save();
      }

      return {
        success: true,
        transactionId: result.transaction_id,
        status,
        paidAt: result.settlement_time
          ? new Date(result.settlement_time)
          : undefined,
        paymentMethod: result.payment_type,
        amount: parseFloat(result.gross_amount),
        message: "Payment verification successful",
      };
    } catch (error: any) {
      logger.error("Failed to verify payment:", error);
      throw error;
    }
  }

  async processWebhook(
    payload: any
  ): Promise<{ success: boolean; status: PaymentStatus }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        order_id,
        transaction_status,
        fraud_status,
        payment_type,
        transaction_id,
        signature_key,
        gross_amount,
      } = payload;

      const isValidSignature = verifyWebhookSignature(
        order_id,
        transaction_status,
        gross_amount,
        config.midtrans.serverKey || "",
        signature_key
      );

      if (!isValidSignature) {
        throw new Error("Invalid Webhook Signature");
      }

      const newStatus = mapMidtransStatus(transaction_status, fraud_status);
      const payment = await Payment.findOne({
        $or: [{ orderId: order_id }, { transactionId: transaction_id }],
      }).session(session);

      if (!payment)
        throw new NotFoundError(`Payment not found for Order ID: ${order_id}`);

      if (payment.status === newStatus) {
        await session.commitTransaction();
        return { success: true, status: newStatus };
      }

      payment.status = newStatus;
      payment.paymentMethod = payment_type || payment.paymentMethod;

      if (
        newStatus === PaymentStatus.SETTLEMENT ||
        newStatus === PaymentStatus.CAPTURE
      ) {
        payment.paidAt = new Date();
      }

      await payment.save({ session });

      if (
        newStatus === PaymentStatus.SETTLEMENT ||
        newStatus === PaymentStatus.CAPTURE
      ) {
        const enrollment = await Enrollment.findById(
          payment.enrollmentId
        ).session(session);
        if (enrollment) {
          enrollment.status = "active";
          if (["pending_payment", "cancelled"].includes(enrollment.status))
            enrollment.progress = 0;
          await enrollment.save({ session });
        }
      } else if (
        newStatus === PaymentStatus.CANCEL ||
        newStatus === PaymentStatus.EXPIRE
      ) {
        const enrollment = await Enrollment.findById(
          payment.enrollmentId
        ).session(session);
        if (enrollment && enrollment.status === "pending_payment") {
          enrollment.status = "cancelled";
          await enrollment.save({ session });
        }
      }

      await session.commitTransaction();
      logger.info(`Webhook processed: ${order_id} -> ${newStatus}`);
      return { success: true, status: newStatus };
    } catch (error: any) {
      await session.abortTransaction();
      logger.error("Failed to process webhook:", error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async cancelTransaction(transactionId: string): Promise<void> {
    try {
      await (coreApi as any).transaction.cancel(transactionId);
      await Payment.findOneAndUpdate(
        { transactionId },
        { status: PaymentStatus.CANCEL }
      );
    } catch (error: any) {
      logger.error(`Failed to cancel transaction ${transactionId}:`, error);
      throw error;
    }
  }

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
      if (reason) parameter.reason = reason;

      const result: any = await (coreApi as any).transaction.refund(
        transactionId,
        parameter
      );
      const newStatus = amount
        ? PaymentStatus.PARTIAL_REFUND
        : PaymentStatus.REFUND;
      await Payment.findOneAndUpdate({ transactionId }, { status: newStatus });

      return result;
    } catch (error: any) {
      logger.error(`Failed to refund transaction ${transactionId}:`, error);
      throw error;
    }
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await Payment.findOne({ orderId });
    if (!payment) throw new NotFoundError("Transaction not found");
    return payment;
  }

  async getPaymentById(id: string) {
    const payment = await Payment.findById(id)
      .populate("userId", "fullName email")
      .populate("courseId", "title price");
    if (!payment) throw new NotFoundError("Payment not found");
    return payment;
  }

  async getUserPayments(userId: string, limit: number = 50) {
    return await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("courseId", "title");
  }

  async updatePaymentStatus(transactionId: string, status: string) {
    const payment = await Payment.findOneAndUpdate(
      { transactionId },
      { status },
      { new: true }
    );
    if (!payment) throw new NotFoundError("Transaction not found");
    return payment;
  }

  async getPaymentStatistics() {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    return stats;
  }

  async getAllTransactions(
    page: number = 1,
    limit: number = 10,
    status?: string
  ) {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};
      if (status) {
        query.status = status;
      }
      const total = await Payment.countDocuments(query);
      const transactions = await Payment.find(query)
        .populate("userId", "fullName email")
        .populate("enrollmentId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return {
        transactions,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error("Get all transactions error", error);
      throw error;
    }
  }

  getAvailablePaymentMethods(): Record<string, any> {
    return {
      creditCard: {
        name: "Credit/Debit Card",
        enabled: true,
        icon: "credit-card",
        currencies: ["IDR", "USD"],
      },
      bankTransfer: {
        name: "Bank Transfer",
        enabled: true,
        icon: "bank",
        currencies: ["IDR"],
        banks: ["bca", "bni", "bri", "mandiri"],
      },
      eWallet: {
        name: "E-Wallet",
        enabled: true,
        icon: "wallet",
        currencies: ["IDR"],
        providers: ["gopay", "ovo", "dana", "linkaja"],
      },
      bnpl: {
        name: "Buy Now Pay Later",
        enabled: true,
        icon: "calendar",
        currencies: ["IDR"],
        providers: ["kredivo", "akulaku"],
      },
      echannel: {
        name: "E-Channel (ATM)",
        enabled: true,
        icon: "atm",
        currencies: ["IDR"],
      },
    };
  }

  isPaymentEligible(amount: number): boolean {
    return amount >= 1000 && amount <= 999999999;
  }
}

export default new PaymentService();
