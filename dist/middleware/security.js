"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiVersion = exports.responseHeaders = exports.sanitizeInput = exports.requestLogger = exports.removePoweredBy = exports.helmetMiddleware = exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = __importDefault(require("../config/env"));
/**
 * CORS Configuration
 */
exports.corsMiddleware = (0, cors_1.default)({
    origin: env_1.default.corsOrigin,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});
/**
 * Helmet Security Headers
 */
exports.helmetMiddleware = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"]
        }
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});
/**
 * Remove X-Powered-By header
 */
const removePoweredBy = (_req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
};
exports.removePoweredBy = removePoweredBy;
/**
 * Request logging middleware
 */
const requestLogger = (req, _res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
};
exports.requestLogger = requestLogger;
/**
 * Request body sanitization
 */
const sanitizeInput = (req, _res, next) => {
    if (req.body && typeof req.body === 'object') {
        const sanitizedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                // Remove potential XSS vectors
                sanitizedBody[key] = value
                    .replace(/[<>]/g, '')
                    .trim();
            }
            else {
                sanitizedBody[key] = value;
            }
        }
        req.body = sanitizedBody;
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
/**
 * Response security headers
 */
const responseHeaders = (_req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Clickjacking protection
    res.setHeader('X-Frame-Options', 'DENY');
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'");
    next();
};
exports.responseHeaders = responseHeaders;
/**
 * API version middleware
 */
const apiVersion = (_req, res, next) => {
    res.setHeader('API-Version', '1.0.0');
    next();
};
exports.apiVersion = apiVersion;
exports.default = {
    corsMiddleware: exports.corsMiddleware,
    helmetMiddleware: exports.helmetMiddleware,
    removePoweredBy: exports.removePoweredBy,
    requestLogger: exports.requestLogger,
    sanitizeInput: exports.sanitizeInput,
    responseHeaders: exports.responseHeaders,
    apiVersion: exports.apiVersion
};
//# sourceMappingURL=security.js.map