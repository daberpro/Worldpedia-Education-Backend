"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const midtrans_1 = require("../config/midtrans");
const env_1 = __importDefault(require("../config/env"));
const logger_1 = require("../utils/logger");
const models_1 = require("../models");
const payment_types_1 = require("../types/payment.types");
const payment_validator_1 = require("../utils/payment-validator");
const error_types_1 = require("../types/error.types");
class PaymentService {
    async createTransaction(request) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const validation = (0, payment_validator_1.validateTransactionRequest)(request);
            if (!validation.valid) {
                throw new error_types_1.ValidationError(`Validation failed: ${validation.errors.join(", ")}`);
            }
            const amountValidation = (0, payment_validator_1.validateAmount)(request.amount);
            if (!amountValidation.valid) {
                throw new error_types_1.ValidationError(amountValidation.error || "Invalid amount");
            }
            const transactionId = (0, uuid_1.v4)();
            const orderId = `${request.userId}-${Date.now()}`;
            const enrollmentId = request.metadata?.enrollmentId;
            if (!enrollmentId) {
                throw new error_types_1.ValidationError("Enrollment ID is required in metadata");
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
            const midtransResult = await midtrans_1.snapClient.createTransaction(parameter);
            const payment = new models_1.Payment({
                transactionId,
                orderId,
                userId: request.userId,
                enrollmentId,
                amount: request.amount,
                status: payment_types_1.PaymentStatus.PENDING,
                paymentMethod: "unknown",
                snapToken: midtransResult.token,
                redirectUrl: midtransResult.redirect_url,
                createdAt: new Date(),
            });
            await payment.save({ session });
            await session.commitTransaction();
            logger_1.logger.info(`Transaction created: ${orderId}`);
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
        }
        catch (error) {
            await session.abortTransaction();
            logger_1.logger.error("Failed to create transaction:", error);
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async verifyPayment(transactionId) {
        try {
            const result = await midtrans_1.coreApi.transaction.status(transactionId);
            const status = (0, payment_validator_1.mapMidtransStatus)(result.transaction_status, result.fraud_status);
            const payment = await models_1.Payment.findOne({
                $or: [{ transactionId }, { orderId: transactionId }],
            });
            if (payment && payment.status !== status) {
                payment.status = status;
                payment.paymentMethod = result.payment_type || payment.paymentMethod;
                if (status === payment_types_1.PaymentStatus.SETTLEMENT ||
                    status === payment_types_1.PaymentStatus.CAPTURE) {
                    payment.paidAt = result.settlement_time
                        ? new Date(result.settlement_time)
                        : new Date();
                    await models_1.Enrollment.findByIdAndUpdate(payment.enrollmentId, {
                        status: "active",
                        progress: 0,
                    });
                }
                else if (status === payment_types_1.PaymentStatus.CANCEL ||
                    status === payment_types_1.PaymentStatus.EXPIRE) {
                    await models_1.Enrollment.findByIdAndUpdate(payment.enrollmentId, {
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
        }
        catch (error) {
            logger_1.logger.error("Failed to verify payment:", error);
            throw error;
        }
    }
    async processWebhook(payload) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const { order_id, transaction_status, fraud_status, payment_type, transaction_id, signature_key, gross_amount, } = payload;
            const isValidSignature = (0, payment_validator_1.verifyWebhookSignature)(order_id, transaction_status, gross_amount, env_1.default.midtrans.serverKey || "", signature_key);
            if (!isValidSignature) {
                throw new Error("Invalid Webhook Signature");
            }
            const newStatus = (0, payment_validator_1.mapMidtransStatus)(transaction_status, fraud_status);
            const payment = await models_1.Payment.findOne({
                $or: [{ orderId: order_id }, { transactionId: transaction_id }],
            }).session(session);
            if (!payment)
                throw new error_types_1.NotFoundError(`Payment not found for Order ID: ${order_id}`);
            if (payment.status === newStatus) {
                await session.commitTransaction();
                return { success: true, status: newStatus };
            }
            payment.status = newStatus;
            payment.paymentMethod = payment_type || payment.paymentMethod;
            if (newStatus === payment_types_1.PaymentStatus.SETTLEMENT ||
                newStatus === payment_types_1.PaymentStatus.CAPTURE) {
                payment.paidAt = new Date();
            }
            await payment.save({ session });
            if (newStatus === payment_types_1.PaymentStatus.SETTLEMENT ||
                newStatus === payment_types_1.PaymentStatus.CAPTURE) {
                const enrollment = await models_1.Enrollment.findById(payment.enrollmentId).session(session);
                if (enrollment) {
                    enrollment.status = "active";
                    if (["pending_payment", "cancelled"].includes(enrollment.status))
                        enrollment.progress = 0;
                    await enrollment.save({ session });
                }
            }
            else if (newStatus === payment_types_1.PaymentStatus.CANCEL ||
                newStatus === payment_types_1.PaymentStatus.EXPIRE) {
                const enrollment = await models_1.Enrollment.findById(payment.enrollmentId).session(session);
                if (enrollment && enrollment.status === "pending_payment") {
                    enrollment.status = "cancelled";
                    await enrollment.save({ session });
                }
            }
            await session.commitTransaction();
            logger_1.logger.info(`Webhook processed: ${order_id} -> ${newStatus}`);
            return { success: true, status: newStatus };
        }
        catch (error) {
            await session.abortTransaction();
            logger_1.logger.error("Failed to process webhook:", error);
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async cancelTransaction(transactionId) {
        try {
            await midtrans_1.coreApi.transaction.cancel(transactionId);
            await models_1.Payment.findOneAndUpdate({ transactionId }, { status: payment_types_1.PaymentStatus.CANCEL });
        }
        catch (error) {
            logger_1.logger.error(`Failed to cancel transaction ${transactionId}:`, error);
            throw error;
        }
    }
    async refundTransaction(transactionId, amount, reason) {
        try {
            const parameter = {};
            if (amount) {
                parameter.refund_key = `refund-${transactionId}-${Date.now()}`;
                parameter.amount = amount;
            }
            if (reason)
                parameter.reason = reason;
            const result = await midtrans_1.coreApi.transaction.refund(transactionId, parameter);
            const newStatus = amount
                ? payment_types_1.PaymentStatus.PARTIAL_REFUND
                : payment_types_1.PaymentStatus.REFUND;
            await models_1.Payment.findOneAndUpdate({ transactionId }, { status: newStatus });
            return result;
        }
        catch (error) {
            logger_1.logger.error(`Failed to refund transaction ${transactionId}:`, error);
            throw error;
        }
    }
    async getPaymentByOrderId(orderId) {
        const payment = await models_1.Payment.findOne({ orderId });
        if (!payment)
            throw new error_types_1.NotFoundError("Transaction not found");
        return payment;
    }
    async getPaymentById(id) {
        const payment = await models_1.Payment.findById(id)
            .populate("userId", "fullName email")
            .populate("courseId", "title price");
        if (!payment)
            throw new error_types_1.NotFoundError("Payment not found");
        return payment;
    }
    async getUserPayments(userId, limit = 50) {
        return await models_1.Payment.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("courseId", "title");
    }
    async updatePaymentStatus(transactionId, status) {
        const payment = await models_1.Payment.findOneAndUpdate({ transactionId }, { status }, { new: true });
        if (!payment)
            throw new error_types_1.NotFoundError("Transaction not found");
        return payment;
    }
    async getPaymentStatistics() {
        const stats = await models_1.Payment.aggregate([
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
    async getAllTransactions(page = 1, limit = 10, status) {
        try {
            const skip = (page - 1) * limit;
            const query = {};
            if (status) {
                query.status = status;
            }
            const total = await models_1.Payment.countDocuments(query);
            const transactions = await models_1.Payment.find(query)
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
        }
        catch (error) {
            logger_1.logger.error("Get all transactions error", error);
            throw error;
        }
    }
    getAvailablePaymentMethods() {
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
    isPaymentEligible(amount) {
        return amount >= 1000 && amount <= 999999999;
    }
}
exports.PaymentService = PaymentService;
exports.default = new PaymentService();
//# sourceMappingURL=payment.service.js.map