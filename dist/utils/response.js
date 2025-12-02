"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletedResponse = exports.updatedResponse = exports.createdResponse = exports.validationErrorResponse = exports.errorResponse = exports.paginatedResponse = exports.successResponse = void 0;
/**
 * Format success response
 */
const successResponse = (data, message = 'Success') => {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
    };
};
exports.successResponse = successResponse;
/**
 * Format paginated success response
 */
const paginatedResponse = (items, total, page, limit) => {
    const pages = Math.ceil(total / limit);
    return {
        success: true,
        data: {
            items,
            pagination: {
                total,
                page,
                limit,
                pages
            }
        },
        timestamp: new Date().toISOString()
    };
};
exports.paginatedResponse = paginatedResponse;
/**
 * Format error response
 */
const errorResponse = (error) => {
    return {
        success: false,
        error,
        timestamp: new Date().toISOString()
    };
};
exports.errorResponse = errorResponse;
/**
 * Format validation error response
 */
const validationErrorResponse = (errors) => {
    const errorMessages = Object.entries(errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join('; ');
    return {
        success: false,
        error: 'Validation failed',
        message: errorMessages,
        timestamp: new Date().toISOString()
    };
};
exports.validationErrorResponse = validationErrorResponse;
/**
 * Format created response
 */
const createdResponse = (data, message = 'Created successfully') => {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
    };
};
exports.createdResponse = createdResponse;
/**
 * Format updated response
 */
const updatedResponse = (data, message = 'Updated successfully') => {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
    };
};
exports.updatedResponse = updatedResponse;
/**
 * Format deleted response
 */
const deletedResponse = (message = 'Deleted successfully') => {
    return {
        success: true,
        message,
        timestamp: new Date().toISOString()
    };
};
exports.deletedResponse = deletedResponse;
exports.default = {
    successResponse: exports.successResponse,
    paginatedResponse: exports.paginatedResponse,
    errorResponse: exports.errorResponse,
    validationErrorResponse: exports.validationErrorResponse,
    createdResponse: exports.createdResponse,
    updatedResponse: exports.updatedResponse,
    deletedResponse: exports.deletedResponse
};
//# sourceMappingURL=response.js.map