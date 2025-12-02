"use strict";
/**
 * Payment & Transaction Types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.PaymentStatus = void 0;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SETTLEMENT"] = "settlement";
    PaymentStatus["CAPTURE"] = "capture";
    PaymentStatus["DENY"] = "deny";
    PaymentStatus["CANCEL"] = "cancel";
    PaymentStatus["EXPIRE"] = "expire";
    PaymentStatus["REFUND"] = "refund";
    PaymentStatus["PARTIAL_REFUND"] = "partial_refund";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["ECHANNEL"] = "echannel";
    PaymentMethod["E_WALLET"] = "e_wallet";
    PaymentMethod["BNPL"] = "bnpl";
    PaymentMethod["COD"] = "cod";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
//# sourceMappingURL=payment.types.js.map