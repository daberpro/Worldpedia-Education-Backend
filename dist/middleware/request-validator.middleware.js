"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = exports.requestLogger = exports.requestValidator = void 0;
const logger_1 = require("../utils/logger");
/**
 * Request Validator Middleware
 * Validates and sanitizes incoming requests
 */
const requestValidator = (req, _res, next) => {
    /**
     * Validate Content-Type for non-GET requests
     */
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'];
        if (!contentType) {
            logger_1.logger.warn(`Missing Content-Type header for ${req.method} ${req.path}`);
        }
        else if (!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded')) {
            logger_1.logger.warn(`Unsupported Content-Type: ${contentType} for ${req.method} ${req.path}`);
        }
    }
    /**
     * Sanitize request body - remove null/undefined from top level
     */
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === undefined) {
                delete req.body[key];
            }
        });
    }
    /**
     * Sanitize query parameters - trim strings
     */
    if (req.query && typeof req.query === 'object') {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }
    /**
     * Validate request size (should be handled by express.json limit, but extra check)
     */
    if (req.headers['content-length']) {
        const contentLength = parseInt(req.headers['content-length'], 10);
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (contentLength > maxSize) {
            logger_1.logger.warn(`Request payload too large: ${contentLength} bytes from ${req.ip}`);
        }
    }
    next();
};
exports.requestValidator = requestValidator;
/**
 * Request Logger Middleware
 * Logs incoming requests with detailed information
 */
const requestLogger = (req, _res, next) => {
    const startTime = Date.now();
    const requestId = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Attach request ID to request object
    req.requestId = requestId;
    // Log request
    logger_1.logger.debug(`📨 ${req.method} ${req.path} [${requestId}]`);
    // Log response time when response is sent
    const originalSend = _res.send;
    _res.send = function (data) {
        const duration = Date.now() - startTime;
        const status = _res.statusCode;
        // Log with appropriate level based on status code
        if (status >= 500) {
            logger_1.logger.error(`❌ ${req.method} ${req.path} - ${status} (${duration}ms) [${requestId}]`);
        }
        else if (status >= 400) {
            logger_1.logger.warn(`⚠️  ${req.method} ${req.path} - ${status} (${duration}ms) [${requestId}]`);
        }
        else {
            logger_1.logger.info(`✅ ${req.method} ${req.path} - ${status} (${duration}ms) [${requestId}]`);
        }
        return originalSend.call(this, data);
    };
    next();
};
exports.requestLogger = requestLogger;
/**
 * Request ID Middleware
 * Adds unique request ID to all requests for tracing
 */
const requestIdMiddleware = (req, res, next) => {
    const requestId = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
exports.default = exports.requestValidator;
//# sourceMappingURL=request-validator.middleware.js.map