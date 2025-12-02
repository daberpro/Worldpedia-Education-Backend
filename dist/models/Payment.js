"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const payment_types_1 = require("../types/payment.types");
/**
 * Payment Schema
 */
const paymentSchema = new mongoose_1.Schema({
    enrollmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true,
        index: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        default: null,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: Object.values(payment_types_1.PaymentStatus),
        default: payment_types_1.PaymentStatus.PENDING,
        index: true
    },
    paymentMethod: {
        type: String,
        default: 'unknown'
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    midtransToken: { type: String, default: null },
    redirectUrl: { type: String, default: null },
    failureReason: { type: String, default: null },
    paidAt: { type: Date, default: null }
}, { timestamps: true });
/**
 * INDEXES
 */
paymentSchema.index({ enrollmentId: 1, status: 1 });
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ paidAt: 1 });
/**
 * METHODS
 */
paymentSchema.methods.markCompleted = function () {
    this.status = payment_types_1.PaymentStatus.COMPLETED;
    this.paidAt = new Date();
};
paymentSchema.methods.markFailed = function (reason) {
    this.status = payment_types_1.PaymentStatus.FAILED;
    this.failureReason = reason;
};
/**
 * VIRTUAL FIELDS
 */
paymentSchema.virtual('studentId').get(function () { return this.userId; }).set(function (value) { this.userId = value; });
paymentSchema.virtual('completedAt').get(function () { return this.paidAt; }).set(function (value) { this.paidAt = value; });
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });
exports.Payment = mongoose_1.default.model('Payment', paymentSchema);
//# sourceMappingURL=Payment.js.map