"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusColor = exports.calculateTaxRate = exports.validateDiscount = exports.formatCurrency = exports.generateInvoiceNumber = exports.mapMidtransStatus = exports.verifyWebhookSignature = exports.validateTransactionRequest = exports.validatePhoneNumber = exports.validateEmail = exports.validateAmount = void 0;
const crypto_1 = require("crypto");
const logger_1 = require("./logger");
const payment_types_1 = require("../types/payment.types");
/**
 * Validate transaction amount
 * Min: 1000 IDR, Max: 999,999,999 IDR
 */
const validateAmount = (amount) => {
    if (!amount || typeof amount !== 'number') {
        return { valid: false, error: 'Amount must be a number' };
    }
    if (amount < 1000) {
        return { valid: false, error: 'Minimum amount is 1000 IDR' };
    }
    if (amount > 999999999) {
        return { valid: false, error: 'Maximum amount is 999999999 IDR' };
    }
    return { valid: true };
};
exports.validateAmount = validateAmount;
/**
 * Validate email format
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
/**
 * Validate phone number format
 */
const validatePhoneNumber = (phone) => {
    // Accept +62, 0, or without country code
    const phoneRegex = /^(\+62|0|62)?[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};
exports.validatePhoneNumber = validatePhoneNumber;
/**
 * Comprehensive transaction request validation
 */
const validateTransactionRequest = (request) => {
    const errors = [];
    // Validate amount
    const amountValidation = (0, exports.validateAmount)(request.amount);
    if (!amountValidation.valid) {
        errors.push(amountValidation.error || 'Invalid amount');
    }
    // Validate order ID
    if (!request.orderId || typeof request.orderId !== 'string') {
        errors.push('Order ID is required');
    }
    // Validate user ID
    if (!request.userId || typeof request.userId !== 'string') {
        errors.push('User ID is required');
    }
    // Validate customer details
    if (!request.customerDetails) {
        errors.push('Customer details are required');
    }
    else {
        if (!request.customerDetails.firstName) {
            errors.push('Customer first name is required');
        }
        if (!request.customerDetails.lastName) {
            errors.push('Customer last name is required');
        }
        if (!request.customerDetails.email || !(0, exports.validateEmail)(request.customerDetails.email)) {
            errors.push('Valid customer email is required');
        }
        if (!request.customerDetails.phone || !(0, exports.validatePhoneNumber)(request.customerDetails.phone)) {
            errors.push('Valid customer phone number is required');
        }
    }
    // Validate items
    if (!request.items || !Array.isArray(request.items) || request.items.length === 0) {
        errors.push('At least one item is required');
    }
    else {
        request.items.forEach((item, index) => {
            if (!item.id)
                errors.push(`Item ${index + 1}: ID is required`);
            if (!item.name)
                errors.push(`Item ${index + 1}: Name is required`);
            if (!item.price || item.price <= 0)
                errors.push(`Item ${index + 1}: Valid price is required`);
            if (!item.quantity || item.quantity <= 0)
                errors.push(`Item ${index + 1}: Valid quantity is required`);
        });
    }
    // Validate discount if provided
    if (request.discount !== undefined) {
        if (request.discount < 0 || request.discount > request.amount) {
            errors.push('Discount must be between 0 and amount');
        }
    }
    return {
        valid: errors.length === 0,
        errors
    };
};
exports.validateTransactionRequest = validateTransactionRequest;
/**
 * Verify webhook signature from Midtrans
 */
const verifyWebhookSignature = (transactionId, statusCode, grossAmount, serverKey, signatureKey) => {
    try {
        const data = `${transactionId}${statusCode}${grossAmount}${serverKey}`;
        const hash = (0, crypto_1.createHash)('sha512').update(data).digest('hex');
        return hash === signatureKey;
    }
    catch (error) {
        logger_1.logger.error('Error verifying webhook signature:', error);
        return false;
    }
};
exports.verifyWebhookSignature = verifyWebhookSignature;
/**
 * Map Midtrans status to PaymentStatus enum
 */
const mapMidtransStatus = (midtransStatus, fraudStatus) => {
    const statusMap = {
        settlement: payment_types_1.PaymentStatus.SETTLEMENT,
        capture: payment_types_1.PaymentStatus.CAPTURE,
        pending: payment_types_1.PaymentStatus.PENDING,
        deny: payment_types_1.PaymentStatus.DENY,
        cancel: payment_types_1.PaymentStatus.CANCEL,
        expire: payment_types_1.PaymentStatus.EXPIRE,
        refund: payment_types_1.PaymentStatus.REFUND,
        partial_refund: payment_types_1.PaymentStatus.PARTIAL_REFUND
    };
    // Check fraud status first
    if (fraudStatus === 'challenge') {
        return payment_types_1.PaymentStatus.PENDING;
    }
    if (fraudStatus === 'accept') {
        return payment_types_1.PaymentStatus.SETTLEMENT;
    }
    return statusMap[midtransStatus] || payment_types_1.PaymentStatus.PENDING;
};
exports.mapMidtransStatus = mapMidtransStatus;
/**
 * Generate unique invoice number
 */
const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `INV-${timestamp}-${random}`;
};
exports.generateInvoiceNumber = generateInvoiceNumber;
/**
 * Format currency to Indonesian Rupiah
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
/**
 * Validate discount
 */
const validateDiscount = (discount, amount) => {
    if (discount < 0) {
        return { valid: false, error: 'Discount cannot be negative' };
    }
    if (discount > amount) {
        return { valid: false, error: 'Discount cannot exceed transaction amount' };
    }
    return { valid: true };
};
exports.validateDiscount = validateDiscount;
/**
 * Calculate tax rate (default 10% for Indonesia)
 */
const calculateTaxRate = (subtotal, taxRate = 0.1) => {
    return subtotal * taxRate;
};
exports.calculateTaxRate = calculateTaxRate;
/**
 * Get status color for UI display
 */
const getStatusColor = (status) => {
    const colorMap = {
        [payment_types_1.PaymentStatus.PENDING]: 'warning',
        [payment_types_1.PaymentStatus.SETTLEMENT]: 'success',
        [payment_types_1.PaymentStatus.CAPTURE]: 'success',
        [payment_types_1.PaymentStatus.DENY]: 'danger',
        [payment_types_1.PaymentStatus.CANCEL]: 'secondary',
        [payment_types_1.PaymentStatus.EXPIRE]: 'secondary',
        [payment_types_1.PaymentStatus.REFUND]: 'info',
        [payment_types_1.PaymentStatus.PARTIAL_REFUND]: 'info',
        [payment_types_1.PaymentStatus.COMPLETED]: 'success',
        [payment_types_1.PaymentStatus.FAILED]: 'danger'
    };
    return colorMap[status] || 'secondary';
};
exports.getStatusColor = getStatusColor;
//# sourceMappingURL=payment-validator.js.map