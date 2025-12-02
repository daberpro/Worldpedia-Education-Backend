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
exports.Form = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Form Schema
 */
const formSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required'],
        index: true
    },
    title: {
        type: String,
        required: [true, 'Form title is required'],
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title must not exceed 100 characters'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Form description is required'],
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [500, 'Description must not exceed 500 characters']
    },
    fields: {
        type: [
            {
                fieldId: {
                    type: String,
                    required: true
                },
                fieldName: {
                    type: String,
                    required: true,
                    lowercase: true
                },
                fieldType: {
                    type: String,
                    enum: [
                        'text',
                        'email',
                        'number',
                        'date',
                        'checkbox',
                        'radio',
                        'select',
                        'textarea'
                    ],
                    required: true
                },
                label: {
                    type: String,
                    required: true
                },
                placeholder: String,
                required: {
                    type: Boolean,
                    default: false
                },
                options: [String],
                validation: {
                    minLength: Number,
                    maxLength: Number,
                    pattern: String,
                    min: Number,
                    max: Number
                }
            }
        ],
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 1 && v.length <= 50;
            },
            message: 'Form must have between 1 and 50 fields'
        }
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    submissionCount: {
        type: Number,
        default: 0,
        min: 0
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
formSchema.index({ courseId: 1, isActive: 1 });
formSchema.index({ createdBy: 1 });
formSchema.index({ createdAt: -1 });
/**
 * METHODS
 */
/**
 * Add new field to form
 */
formSchema.methods.addField = function (field) {
    if (this.fields.length >= 50) {
        throw new Error('Form cannot have more than 50 fields');
    }
    this.fields.push(field);
};
/**
 * Remove field from form
 */
formSchema.methods.removeField = function (fieldId) {
    this.fields = this.fields.filter((f) => f.fieldId !== fieldId);
};
/**
 * Increment submission count
 */
formSchema.methods.incrementSubmissionCount = function () {
    this.submissionCount += 1;
};
/**
 * Export Form Model
 */
exports.Form = mongoose_1.default.model('Form', formSchema);
//# sourceMappingURL=Form.js.map