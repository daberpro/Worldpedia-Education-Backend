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
exports.Help = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Help Schema
 */
const helpSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: [true, 'Question is required'],
        minlength: [5, 'Question must be at least 5 characters'],
        maxlength: [200, 'Question must not exceed 200 characters'],
        index: true,
        trim: true
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
        minlength: [10, 'Answer must be at least 10 characters'],
        maxlength: [2000, 'Answer must not exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: [
                'account',
                'course',
                'enrollment',
                'payment',
                'certificate',
                'technical',
                'other'
            ],
            message: 'Invalid category'
        },
        index: true
    },
    keywords: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return v.length <= 10;
            },
            message: 'Cannot have more than 10 keywords'
        }
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    helpful: {
        type: Number,
        default: 0,
        min: 0
    },
    notHelpful: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required'],
    }
}, {
    timestamps: true
});
/**
 * INDEXES for performance
 */
helpSchema.index({ question: 'text', answer: 'text', keywords: 'text' });
helpSchema.index({ category: 1, isActive: 1 });
helpSchema.index({ createdBy: 1 });
helpSchema.index({ views: -1 });
helpSchema.index({ createdAt: -1 });
/**
 * METHODS
 */
/**
 * Increment view count
 */
helpSchema.methods.incrementViews = function () {
    this.views += 1;
};
/**
 * Mark as helpful
 */
helpSchema.methods.markHelpful = function () {
    this.helpful += 1;
};
/**
 * Mark as not helpful
 */
helpSchema.methods.markNotHelpful = function () {
    this.notHelpful += 1;
};
/**
 * Get helpfulness percentage
 */
helpSchema.methods.getHelpfulnessPercentage = function () {
    const total = this.helpful + this.notHelpful;
    if (total === 0)
        return 0;
    return Math.round((this.helpful / total) * 100);
};
/**
 * Export Help Model
 */
exports.Help = mongoose_1.default.model('Help', helpSchema);
//# sourceMappingURL=Help.js.map