import { Request, Response } from 'express';
export declare class PaymentController {
    createTransaction(req: Request, res: Response): Promise<void>;
    verifyPayment(req: Request, res: Response): Promise<void>;
    getPaymentStatus(req: Request, res: Response): Promise<void>;
    cancelPayment(req: Request, res: Response): Promise<void>;
    refundPayment(req: Request, res: Response): Promise<void>;
    handleWebhook(req: Request, res: Response): Promise<void>;
    getPaymentHistory(req: Request, res: Response): Promise<void>;
    getInvoice(req: Request, res: Response): Promise<void>;
    getPaymentMethods(_req: Request, res: Response): Promise<void>;
    getStatistics(_req: Request, res: Response): Promise<void>;
    getAllTransactions(req: Request, res: Response): Promise<void>;
    updateTransactionStatus(req: Request, res: Response): Promise<void>;
}
declare const _default: PaymentController;
export default _default;
//# sourceMappingURL=payment.controller.d.ts.map