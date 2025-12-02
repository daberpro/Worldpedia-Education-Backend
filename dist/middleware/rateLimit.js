"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userApiLimiter = exports.paymentLimiter = exports.forgotPasswordLimiter = exports.resendCodeLimiter = exports.verifyCodeLimiter = exports.registerLimiter = exports.loginLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_types_1 = require("../types/error.types");
/**
 * General rate limiter (100 requests per 15 minutes)
 */
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (_req, _res) => {
        throw new error_types_1.TooManyRequestsError('Too many requests, please try again later');
    }
});
/**
 * Auth endpoints rate limiter (5 attempts per 15 minutes for login)
 */
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (_req, _res) => {
        throw new error_types_1.TooManyRequestsError('Too many login attempts. Please try again in 15 minutes.');
    }
});
/**
 * Register endpoint rate limiter (3 attempts per hour)
 */
exports.registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: 'Too many accounts created from this IP, please try again later.',
    handler: (_req, _res) => {
        throw new error_types_1.TooManyRequestsError('Too many registration attempts. Please try again in 1 hour.');
    }
});
/**
 * Email verification code limiter (5 attempts per 15 minutes)
 */
exports.verifyCodeLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many verification attempts.',
    handler: (_req, _res) => {
        throw new error_types_1.TooManyRequestsError('Too many verification attempts. Please try again in 15 minutes.');
    }
});
/**
 * Resend code limiter (3 attempts per hour)
 */
exports.resendCodeLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: 'Too many code resend requests.',
    handler: (_req, _res) => {
        throw new error_types_1.TooManyRequestsError('Too many resend requests. Please try again in 1 hour.');
    }
});
/**
 * Forgot password limiter (3 attempts per hour)
 */
exports.forgotPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: 'Too many password reset requests.',
    handler: (_req, _res) => {
        throw new error_types_1.TooManyRequestsError('Too many password reset requests. Please try again in 1 hour.');
    }
});
/**
 * Payment endpoint limiter (10 requests per hour)
 */
exports.paymentLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 requests
    message: 'Too many payment requests.',
    handler: (_req, _res) => {
        throw new error_types_1.TooManyRequestsError('Too many payment requests. Please try again later.');
    }
});
/**
 * API endpoint limiter (per user, 50 requests per 15 minutes)
 */
exports.userApiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests
    keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise use IP
        return req.user?.userId || req.ip || 'unknown';
    },
    message: 'Too many API requests from this user.',
    handler: (_req, _res) => {
        throw new error_types_1.TooManyRequestsError('Rate limit exceeded. Please try again later.');
    }
});
exports.default = {
    generalLimiter: exports.generalLimiter,
    loginLimiter: exports.loginLimiter,
    registerLimiter: exports.registerLimiter,
    verifyCodeLimiter: exports.verifyCodeLimiter,
    resendCodeLimiter: exports.resendCodeLimiter,
    forgotPasswordLimiter: exports.forgotPasswordLimiter,
    paymentLimiter: exports.paymentLimiter,
    userApiLimiter: exports.userApiLimiter
};
//# sourceMappingURL=rateLimit.js.map