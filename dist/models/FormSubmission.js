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
exports.FormSubmission = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * FormSubmission Schema
 */
const formSubmissionSchema = new mongoose_1.Schema({
    formId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Form',
        required: [true, 'Form ID is required'],
        index: true
    },
    enrollmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: [true, 'Enrollment ID is required'],
        index: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    responses: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Responses are required'],
        default: {}
    },
    submittedAt: {
        type: Date,
        default: () => new Date(),
        index: true
    }
}, {
    timestamps: true
});
/**
 * INDEXES for performance
 */
formSubmissionSchema.index({ formId: 1, enrollmentId: 1 });
formSubmissionSchema.index({ userId: 1, formId: 1 });
formSubmissionSchema.index({ submittedAt: -1 });
/**
 * Prevent duplicate submissions
 */
formSubmissionSchema.index({ enrollmentId: 1, formId: 1 }, { unique: true });
/**
 * Export FormSubmission Model
 */
exports.FormSubmission = mongoose_1.default.model('FormSubmission', formSubmissionSchema);
//# sourceMappingURL=FormSubmission.js.map