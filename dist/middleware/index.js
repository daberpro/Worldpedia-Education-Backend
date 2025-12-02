"use strict";
/**
 * Central export point for all middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOAuthState = exports.initializePassport = exports.apiVersion = exports.responseHeaders = exports.sanitizeInput = exports.removePoweredBy = exports.helmetMiddleware = exports.corsMiddleware = exports.userApiLimiter = exports.paymentLimiter = exports.forgotPasswordLimiter = exports.resendCodeLimiter = exports.verifyCodeLimiter = exports.registerLimiter = exports.loginLimiter = exports.generalLimiter = exports.requestIdMiddleware = exports.requestLogger = exports.requestValidator = exports.globalErrorHandler = exports.requireFields = exports.isResourceOwner = exports.isStudent = exports.isAdmin = exports.authorize = exports.ensureAuthenticated = exports.optionalAuth = exports.authenticate = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return auth_1.authenticate; } });
Object.defineProperty(exports, "optionalAuth", { enumerable: true, get: function () { return auth_1.optionalAuth; } });
Object.defineProperty(exports, "ensureAuthenticated", { enumerable: true, get: function () { return auth_1.ensureAuthenticated; } });
var authorization_1 = require("./authorization");
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return authorization_1.authorize; } });
Object.defineProperty(exports, "isAdmin", { enumerable: true, get: function () { return authorization_1.isAdmin; } });
Object.defineProperty(exports, "isStudent", { enumerable: true, get: function () { return authorization_1.isStudent; } });
Object.defineProperty(exports, "isResourceOwner", { enumerable: true, get: function () { return authorization_1.isResourceOwner; } });
Object.defineProperty(exports, "requireFields", { enumerable: true, get: function () { return authorization_1.requireFields; } });
var error_handler_middleware_1 = require("./error-handler.middleware");
Object.defineProperty(exports, "globalErrorHandler", { enumerable: true, get: function () { return error_handler_middleware_1.errorHandler; } });
var request_validator_middleware_1 = require("./request-validator.middleware");
Object.defineProperty(exports, "requestValidator", { enumerable: true, get: function () { return request_validator_middleware_1.requestValidator; } });
Object.defineProperty(exports, "requestLogger", { enumerable: true, get: function () { return request_validator_middleware_1.requestLogger; } });
Object.defineProperty(exports, "requestIdMiddleware", { enumerable: true, get: function () { return request_validator_middleware_1.requestIdMiddleware; } });
var rateLimit_1 = require("./rateLimit");
Object.defineProperty(exports, "generalLimiter", { enumerable: true, get: function () { return rateLimit_1.generalLimiter; } });
Object.defineProperty(exports, "loginLimiter", { enumerable: true, get: function () { return rateLimit_1.loginLimiter; } });
Object.defineProperty(exports, "registerLimiter", { enumerable: true, get: function () { return rateLimit_1.registerLimiter; } });
Object.defineProperty(exports, "verifyCodeLimiter", { enumerable: true, get: function () { return rateLimit_1.verifyCodeLimiter; } });
Object.defineProperty(exports, "resendCodeLimiter", { enumerable: true, get: function () { return rateLimit_1.resendCodeLimiter; } });
Object.defineProperty(exports, "forgotPasswordLimiter", { enumerable: true, get: function () { return rateLimit_1.forgotPasswordLimiter; } });
Object.defineProperty(exports, "paymentLimiter", { enumerable: true, get: function () { return rateLimit_1.paymentLimiter; } });
Object.defineProperty(exports, "userApiLimiter", { enumerable: true, get: function () { return rateLimit_1.userApiLimiter; } });
var security_1 = require("./security");
Object.defineProperty(exports, "corsMiddleware", { enumerable: true, get: function () { return security_1.corsMiddleware; } });
Object.defineProperty(exports, "helmetMiddleware", { enumerable: true, get: function () { return security_1.helmetMiddleware; } });
Object.defineProperty(exports, "removePoweredBy", { enumerable: true, get: function () { return security_1.removePoweredBy; } });
Object.defineProperty(exports, "sanitizeInput", { enumerable: true, get: function () { return security_1.sanitizeInput; } });
Object.defineProperty(exports, "responseHeaders", { enumerable: true, get: function () { return security_1.responseHeaders; } });
Object.defineProperty(exports, "apiVersion", { enumerable: true, get: function () { return security_1.apiVersion; } });
var google_passport_1 = require("./google-passport");
Object.defineProperty(exports, "initializePassport", { enumerable: true, get: function () { return google_passport_1.initializePassport; } });
var oauth_middleware_1 = require("./oauth.middleware");
Object.defineProperty(exports, "verifyOAuthState", { enumerable: true, get: function () { return oauth_middleware_1.verifyOAuthState; } });
//# sourceMappingURL=index.js.map