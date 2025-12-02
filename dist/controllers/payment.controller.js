"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = __importDefault(require("../services/payment.service"));
const logger_1 = require("../utils/logger");
const utils_1 = require("../utils");
class PaymentController {
    async createTransaction(req, res) {
        try {
            const request = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'User not authenticated' });
                return;
            }
            request.userId = userId;
            const result = await payment_service_1.default.createTransaction(request);
            res.status(201).json({
                success: true,
                data: result,
                message: 'Payment transaction created successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error creating transaction:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async verifyPayment(req, res) {
        try {
            const { transactionId } = req.body;
            if (!transactionId) {
                res.status(400).json({ success: false, error: 'Transaction ID is required' });
                return;
            }
            const result = await payment_service_1.default.verifyPayment(transactionId);
            res.status(200).json({ success: true, data: result, message: 'Payment verified successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error verifying payment:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async getPaymentStatus(req, res) {
        try {
            const { orderId } = req.params;
            const payment = await payment_service_1.default.getPaymentByOrderId(orderId);
            res.status(200).json((0, utils_1.successResponse)(payment));
        }
        catch (error) {
            logger_1.logger.error('Error getting payment status:', error);
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async cancelPayment(req, res) {
        try {
            const { transactionId } = req.body;
            await payment_service_1.default.cancelTransaction(transactionId);
            res.status(200).json({ success: true, message: 'Payment cancelled successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error cancelling payment:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async refundPayment(req, res) {
        try {
            const { transactionId, amount, reason } = req.body;
            const result = await payment_service_1.default.refundTransaction(transactionId, amount, reason);
            res.status(200).json({ success: true, data: result, message: 'Refund processed successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error processing refund:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async handleWebhook(req, res) {
        try {
            await payment_service_1.default.processWebhook(req.body);
            res.status(200).json({ success: true, message: 'Webhook processed successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error processing webhook:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async getPaymentHistory(req, res) {
        try {
            const userId = req.user?.userId;
            const { limit } = req.query;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Authentication required' });
                return;
            }
            const history = await payment_service_1.default.getUserPayments(userId, parseInt(limit) || 50);
            res.status(200).json((0, utils_1.successResponse)(history));
        }
        catch (error) {
            logger_1.logger.error('Error getting history:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async getInvoice(req, res) {
        try {
            const { invoiceId } = req.params;
            // Implementasi sederhana untuk mengambil data invoice dari payment
            const payment = await payment_service_1.default.getPaymentById(invoiceId);
            res.status(200).json((0, utils_1.successResponse)(payment));
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async getPaymentMethods(_req, res) {
        try {
            const methods = payment_service_1.default.getAvailablePaymentMethods();
            res.status(200).json((0, utils_1.successResponse)(methods));
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async getStatistics(_req, res) {
        try {
            const stats = await payment_service_1.default.getPaymentStatistics();
            res.status(200).json((0, utils_1.successResponse)(stats));
        }
        catch (error) {
            logger_1.logger.error('Error getting stats:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async getAllTransactions(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { status } = req.query;
            const result = await payment_service_1.default.getAllTransactions(page, limit, status);
            res.status(200).json((0, utils_1.paginatedResponse)(result.transactions, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Error getting all transactions:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async updateTransactionStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                res.status(400).json({ success: false, error: 'Status is required' });
                return;
            }
            const result = await payment_service_1.default.updatePaymentStatus(id, status);
            res.status(200).json((0, utils_1.successResponse)(result, 'Transaction status updated'));
        }
        catch (error) {
            logger_1.logger.error('Error updating transaction:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.PaymentController = PaymentController;
exports.default = new PaymentController();
//# sourceMappingURL=payment.controller.js.map