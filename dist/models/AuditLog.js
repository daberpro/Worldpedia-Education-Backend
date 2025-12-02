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
exports.AuditLog = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * AuditLog Schema
 */
const auditLogSchema = new mongoose_1.Schema({
    action: {
        type: String,
        required: [true, 'Action is required'],
        index: true,
        trim: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true
    },
    ipAddress: {
        type: String,
        required: [true, 'IP address is required'],
        match: [
            /^(\d{1,3}\.){3}\d{1,3}$/,
            'Invalid IP address format'
        ]
    },
    userAgent: {
        type: String,
        default: ''
    },
    details: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    status: {
        type: String,
        enum: {
            values: ['success', 'failure'],
            message: 'Status must be success or failure'
        },
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: () => new Date(),
        index: true
    }
}, {
    timestamps: false
});
/**
 * INDEXES for performance
 */
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
/**
 * Export AuditLog Model
 */
exports.AuditLog = mongoose_1.default.model('AuditLog', auditLogSchema);
//# sourceMappingURL=AuditLog.js.map