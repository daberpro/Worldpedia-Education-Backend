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
exports.Certificate = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Certificate Schema
 */
const certificateSchema = new mongoose_1.Schema({
    enrollmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: [true, 'Enrollment ID is required'],
        index: true,
        unique: true
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student ID is required'],
        index: true
    },
    batchId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'CertificateBatch',
        default: null,
        index: true
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required'],
        index: true
    },
    googleDriveFileId: {
        type: String,
        required: [true, 'Google Drive File ID is required'],
        unique: true
    },
    googleDriveLink: {
        type: String,
        required: [true, 'Google Drive link is required']
    },
    fileName: {
        type: String,
        required: [true, 'File name is required']
    },
    sequenceNumber: {
        type: Number,
        required: [true, 'Sequence number is required']
    },
    serialNumber: {
        type: String,
        required: [true, 'Serial number is required'],
        unique: true,
        index: true,
        // Format: CERT-{timestamp}-{random}
        match: [/^CERT-\d+-[A-Z0-9]+$/, 'Invalid serial number format']
    },
    status: {
        type: String,
        enum: {
            values: ['available', 'assigned', 'accessed'],
            message: 'Invalid certificate status'
        },
        default: 'available',
        index: true
    },
    issueDate: {
        type: Date,
        required: [true, 'Issue date is required'],
        default: () => new Date(),
        index: true
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true
    },
    assignedDate: {
        type: Date,
        default: null
    },
    accessedDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
/**
 * INDEXES for performance
 */
certificateSchema.index({ batchId: 1, status: 1 });
certificateSchema.index({ courseId: 1, status: 1 });
certificateSchema.index({ assignedTo: 1, status: 1 });
certificateSchema.index({ createdAt: -1 });
/**
 * METHODS
 */
/**
 * Assign certificate to user (FIFO queue)
 */
certificateSchema.methods.assignToUser = function (userId) {
    if (this.status !== 'available') {
        throw new Error('Certificate is not available for assignment');
    }
    this.assignedTo = userId;
    this.status = 'assigned';
    this.assignedDate = new Date();
};
/**
 * Mark certificate as accessed
 */
certificateSchema.methods.markAccessed = function () {
    if (this.status !== 'assigned') {
        throw new Error('Certificate must be assigned before marking as accessed');
    }
    this.status = 'accessed';
    this.accessedDate = new Date();
};
/**
 * Export Certificate Model
 */
exports.Certificate = mongoose_1.default.model('Certificate', certificateSchema);
//# sourceMappingURL=Certificate.js.map