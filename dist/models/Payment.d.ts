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
import mongoose, { Document } from 'mongoose';
import { PaymentStatus } from '../types/payment.types';
/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         transactionId:
 *           type: string
 *           description: ID unik transaksi dari sistem
 *         orderId:
 *           type: string
 *           description: ID order untuk Midtrans
 *         amount:
 *           type: number
 *           description: Jumlah pembayaran
 *         status:
 *           type: string
 *           enum: [pending, settlement, capture, deny, cancel, expire, refund, partial_refund]
 *           description: Status transaksi
 *         paymentMethod:
 *           type: string
 *           description: Metode pembayaran (gopay, bca_va, dll)
 *         snapToken:
 *           type: string
 *           description: Token untuk popup Midtrans Snap
 *         redirectUrl:
 *           type: string
 *           description: URL redirect pembayaran
 *         paidAt:
 *           type: string
 *           format: date-time
 *           description: Waktu pembayaran berhasil
 *       example:
 *         transactionId: "trx_123456789"
 *         orderId: "ORDER-12345"
 *         amount: 250000
 *         status: "settlement"
 *         paymentMethod: "gopay"
 *         snapToken: "abcdef123456"
 *         redirectUrl: "https://app.midtrans.com/redirect/123456"
 *         paidAt: "2025-02-01T10:30:00Z"
 */
/**
 * Payment Interface
 */
export interface IPayment extends Document {
    enrollmentId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    studentId?: mongoose.Types.ObjectId;
    courseId?: mongoose.Types.ObjectId;
    amount: number;
    status: PaymentStatus;
    paymentMethod: string;
    transactionId: string;
    orderId: string;
    midtransToken?: string;
    redirectUrl?: string;
    failureReason?: string;
    paidAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Payment: mongoose.Model<IPayment, {}, {}, {}, mongoose.Document<unknown, {}, IPayment, {}, mongoose.DefaultSchemaOptions> & IPayment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IPayment>;
//# sourceMappingURL=Payment.d.ts.map