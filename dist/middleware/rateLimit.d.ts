/**
 * General rate limiter (100 requests per 15 minutes)
 */
export declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Auth endpoints rate limiter (5 attempts per 15 minutes for login)
 */
export declare const loginLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Register endpoint rate limiter (3 attempts per hour)
 */
export declare const registerLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Email verification code limiter (5 attempts per 15 minutes)
 */
export declare const verifyCodeLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Resend code limiter (3 attempts per hour)
 */
export declare const resendCodeLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Forgot password limiter (3 attempts per hour)
 */
export declare const forgotPasswordLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Payment endpoint limiter (10 requests per hour)
 */
export declare const paymentLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * API endpoint limiter (per user, 50 requests per 15 minutes)
 */
export declare const userApiLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const _default: {
    generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
    loginLimiter: import("express-rate-limit").RateLimitRequestHandler;
    registerLimiter: import("express-rate-limit").RateLimitRequestHandler;
    verifyCodeLimiter: import("express-rate-limit").RateLimitRequestHandler;
    resendCodeLimiter: import("express-rate-limit").RateLimitRequestHandler;
    forgotPasswordLimiter: import("express-rate-limit").RateLimitRequestHandler;
    paymentLimiter: import("express-rate-limit").RateLimitRequestHandler;
    userApiLimiter: import("express-rate-limit").RateLimitRequestHandler;
};
export default _default;
//# sourceMappingURL=rateLimit.d.ts.map