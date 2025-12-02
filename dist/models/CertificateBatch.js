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
exports.CertificateBatch = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * CertificateBatch Schema
 */
const certificateBatchSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required'],
    },
    batchName: {
        type: String,
        required: [true, 'Batch name is required'],
        minlength: [3, 'Batch name must be at least 3 characters'],
        maxlength: [100, 'Batch name must not exceed 100 characters'],
        trim: true
    },
    googleDriveFolderId: {
        type: String,
        required: [true, 'Google Drive Folder ID is required'],
        unique: true
    },
    startSequence: {
        type: Number,
        required: [true, 'Start sequence is required'],
        min: [1, 'Start sequence must be at least 1']
    },
    certificateCount: {
        type: Number,
        required: [true, 'Certificate count is required'],
        min: [1, 'Must have at least 1 certificate'],
        max: [10000, 'Cannot exceed 10000 certificates']
    }
}, {
    timestamps: true
});
/**
 * INDEXES for performance
 */
certificateBatchSchema.index({ courseId: 1 });
certificateBatchSchema.index({ createdAt: -1 });
/**
 * METHODS
 */
/**
 * Get end sequence number
 */
certificateBatchSchema.methods.getEndSequence = function () {
    return this.startSequence + this.certificateCount - 1;
};
/**
 * Export CertificateBatch Model
 */
exports.CertificateBatch = mongoose_1.default.model('CertificateBatch', certificateBatchSchema);
//# sourceMappingURL=CertificateBatch.js.map