"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const error_types_1 = require("../types/error.types");
/**
 * Global Error Handler Middleware
 * Should be placed at the end of all routes and middleware
 */
const errorHandler = (error, _req, res, _next) => {
    /**
     * Extract error details
     */
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    const code = error.code || 'INTERNAL_ERROR';
    /**
     * Log error based on severity
     */
    if (status >= 500) {
        logger_1.logger.error(`[${status}] ${code}: ${message}`, error);
    }
    else if (status >= 400) {
        logger_1.logger.warn(`[${status}] ${code}: ${message}`);
    }
    /**
     * Handle specific error types
     */
    if (error instanceof error_types_1.NotFoundError) {
        return res.status(404).json({
            success: false,
            error: error.message,
            code: 'NOT_FOUND',
            status: 404
        });
    }
    if (error instanceof error_types_1.ConflictError) {
        return res.status(409).json({
            success: false,
            error: error.message,
            code: 'CONFLICT',
            status: 409
        });
    }
    if (error instanceof error_types_1.ForbiddenError) {
        return res.status(403).json({
            success: false,
            error: error.message,
            code: 'FORBIDDEN',
            status: 403
        });
    }
    if (error instanceof error_types_1.ValidationError) {
        return res.status(400).json({
            success: false,
            error: error.message,
            code: 'VALIDATION_ERROR',
            status: 400
        });
    }
    /**
     * Handle JWT errors
     */
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token',
            code: 'INVALID_TOKEN',
            status: 401
        });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token has expired',
            code: 'TOKEN_EXPIRED',
            status: 401
        });
    }
    /**
     * Handle MongoDB errors
     */
    if (error.name === 'MongooseError' || error.name === 'MongoServerError') {
        logger_1.logger.error('Database Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Database operation failed',
            code: 'DATABASE_ERROR',
            status: 500
        });
    }
    /**
     * Handle validation errors (Mongoose)
     */
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            status: 400,
            details: Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message
            }))
        });
    }
    /**
     * Handle cast errors (Invalid MongoDB ID)
     */
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid identifier format',
            code: 'CAST_ERROR',
            status: 400
        });
    }
    /**
     * Default error response
     */
    const isDevelopment = process.env.NODE_ENV === 'development';
    return res.status(status).json({
        success: false,
        error: isDevelopment ? message : 'An error occurred',
        code,
        status,
        ...(isDevelopment && { stack: error.stack })
    });
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
//# sourceMappingURL=error-handler.middleware.js.map