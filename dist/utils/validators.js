"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHtml = exports.sanitizeString = exports.isValidDuration = exports.isValidCapacity = exports.isValidPrice = exports.isValidProgress = exports.isValidHelpCategory = exports.isValidUserRole = exports.isValidPaymentStatus = exports.isValidEnrollmentStatus = exports.isValidCourseLevel = exports.isValidEnum = exports.validatePagination = exports.isValidPhoneNumber = exports.isValidObjectId = exports.isValidUrl = exports.isValidEmail = void 0;
/**
 * Email validation
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};
exports.isValidEmail = isValidEmail;
/**
 * URL validation
 */
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
/**
 * Mongo ObjectId validation
 */
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
exports.isValidObjectId = isValidObjectId;
/**
 * Phone number validation (Indonesia)
 */
const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};
exports.isValidPhoneNumber = isValidPhoneNumber;
/**
 * Validate pagination parameters
 */
const validatePagination = (page, limit) => {
    const parsedPage = Math.max(1, page ? Math.floor(page) : 1);
    const parsedLimit = Math.min(100, Math.max(1, limit ? Math.floor(limit) : 10));
    return { page: parsedPage, limit: parsedLimit };
};
exports.validatePagination = validatePagination;
/**
 * Validate enum value
 */
const isValidEnum = (value, enumValues) => {
    return enumValues.includes(value);
};
exports.isValidEnum = isValidEnum;
/**
 * Validate course level
 */
const isValidCourseLevel = (level) => {
    const validLevels = ['PAUD', 'TK', 'SD', 'SMP', 'SMA', 'UMUM'];
    return validLevels.includes(level);
};
exports.isValidCourseLevel = isValidCourseLevel;
/**
 * Validate enrollment status
 */
const isValidEnrollmentStatus = (status) => {
    const validStatuses = ['pending_payment', 'active', 'completed', 'cancelled'];
    return validStatuses.includes(status);
};
exports.isValidEnrollmentStatus = isValidEnrollmentStatus;
/**
 * Validate payment status
 */
const isValidPaymentStatus = (status) => {
    const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
    return validStatuses.includes(status);
};
exports.isValidPaymentStatus = isValidPaymentStatus;
/**
 * Validate user role
 */
const isValidUserRole = (role) => {
    const validRoles = ['student', 'admin'];
    return validRoles.includes(role);
};
exports.isValidUserRole = isValidUserRole;
/**
 * Validate help category
 */
const isValidHelpCategory = (category) => {
    const validCategories = ['account', 'course', 'enrollment', 'payment', 'certificate', 'technical', 'other'];
    return validCategories.includes(category);
};
exports.isValidHelpCategory = isValidHelpCategory;
/**
 * Validate progress (0-100)
 */
const isValidProgress = (progress) => {
    return progress >= 0 && progress <= 100 && Number.isInteger(progress);
};
exports.isValidProgress = isValidProgress;
/**
 * Validate price (non-negative)
 */
const isValidPrice = (price) => {
    return price >= 0 && !Number.isNaN(price);
};
exports.isValidPrice = isValidPrice;
/**
 * Validate capacity
 */
const isValidCapacity = (capacity) => {
    return capacity >= 1 && capacity <= 500 && Number.isInteger(capacity);
};
exports.isValidCapacity = isValidCapacity;
/**
 * Validate duration
 */
const isValidDuration = (duration) => {
    return duration >= 1 && Number.isInteger(duration);
};
exports.isValidDuration = isValidDuration;
/**
 * Sanitize string input
 */
const sanitizeString = (input) => {
    return input
        .trim()
        .replace(/[<>]/g, '')
        .substring(0, 1000); // Limit length
};
exports.sanitizeString = sanitizeString;
/**
 * Escape HTML characters
 */
const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
exports.escapeHtml = escapeHtml;
exports.default = {
    isValidEmail: exports.isValidEmail,
    isValidUrl: exports.isValidUrl,
    isValidObjectId: exports.isValidObjectId,
    isValidPhoneNumber: exports.isValidPhoneNumber,
    validatePagination: exports.validatePagination,
    isValidEnum: exports.isValidEnum,
    isValidCourseLevel: exports.isValidCourseLevel,
    isValidEnrollmentStatus: exports.isValidEnrollmentStatus,
    isValidPaymentStatus: exports.isValidPaymentStatus,
    isValidUserRole: exports.isValidUserRole,
    isValidHelpCategory: exports.isValidHelpCategory,
    isValidProgress: exports.isValidProgress,
    isValidPrice: exports.isValidPrice,
    isValidCapacity: exports.isValidCapacity,
    isValidDuration: exports.isValidDuration,
    sanitizeString: exports.sanitizeString,
    escapeHtml: exports.escapeHtml
};
//# sourceMappingURL=validators.js.map