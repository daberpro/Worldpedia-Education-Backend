"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const error_types_1 = require("../types/error.types");
/**
 * JWT Authentication Middleware
 */
const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_types_1.UnauthorizedError('No token provided');
        }
        const token = authHeader.substring(7); // Remove 'Bearer '
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtAccessSecret);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new error_types_1.UnauthorizedError('Token has expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new error_types_1.UnauthorizedError('Invalid token');
        }
        throw error;
    }
};
exports.authenticate = authenticate;
/**
 * Optional Authentication Middleware
 * Doesn't fail if no token provided, just sets user to undefined
 */
const optionalAuth = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtAccessSecret);
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                username: decoded.username,
                role: decoded.role
            };
        }
        next();
    }
    catch (error) {
        // Silently fail - user will be undefined
        next();
    }
};
exports.optionalAuth = optionalAuth;
/**
 * Verify user is authenticated
 */
const ensureAuthenticated = (req, _res, next) => {
    if (!req.user) {
        throw new error_types_1.UnauthorizedError('Authentication required');
    }
    next();
};
exports.ensureAuthenticated = ensureAuthenticated;
exports.default = { authenticate: exports.authenticate, optionalAuth: exports.optionalAuth, ensureAuthenticated: exports.ensureAuthenticated };
//# sourceMappingURL=auth.js.map