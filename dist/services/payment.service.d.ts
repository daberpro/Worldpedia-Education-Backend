/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import mongoose from "mongoose";
import { TransactionRequest, CreatePaymentResponse, VerifyPaymentResponse, PaymentStatus } from "../types/payment.types";
export declare class PaymentService {
    createTransaction(request: TransactionRequest): Promise<CreatePaymentResponse>;
    verifyPayment(transactionId: string): Promise<VerifyPaymentResponse>;
    processWebhook(payload: any): Promise<{
        success: boolean;
        status: PaymentStatus;
    }>;
    cancelTransaction(transactionId: string): Promise<void>;
    refundTransaction(transactionId: string, amount?: number, reason?: string): Promise<any>;
    getPaymentByOrderId(orderId: string): Promise<mongoose.Document<unknown, {}, import("../models").IPayment, {}, mongoose.DefaultSchemaOptions> & import("../models").IPayment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPaymentById(id: string): Promise<mongoose.Document<unknown, {}, import("../models").IPayment, {}, mongoose.DefaultSchemaOptions> & import("../models").IPayment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getUserPayments(userId: string, limit?: number): Promise<(mongoose.Document<unknown, {}, import("../models").IPayment, {}, mongoose.DefaultSchemaOptions> & import("../models").IPayment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updatePaymentStatus(transactionId: string, status: string): Promise<mongoose.Document<unknown, {}, import("../models").IPayment, {}, mongoose.DefaultSchemaOptions> & import("../models").IPayment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPaymentStatistics(): Promise<any[]>;
    getAllTransactions(page?: number, limit?: number, status?: string): Promise<{
        transactions: (mongoose.Document<unknown, {}, import("../models").IPayment, {}, mongoose.DefaultSchemaOptions> & import("../models").IPayment & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getAvailablePaymentMethods(): Record<string, any>;
    isPaymentEligible(amount: number): boolean;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=payment.service.d.ts.map