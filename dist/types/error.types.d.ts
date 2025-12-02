/**
 * Custom Error Classes
 */
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare class ValidationError extends AppError {
    errors: Record<string, string>;
    constructor(message: string, errors?: Record<string, string>);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
export declare class TooManyRequestsError extends AppError {
    constructor(message?: string);
}
export declare class BadGatewayError extends AppError {
    constructor(message?: string);
}
/**
 * Error Response Type
 */
export interface ErrorType {
    message: string;
    statusCode: number;
    errors?: Record<string, string>;
    isOperational: boolean;
}
/**
 * Error Logger
 */
export interface ErrorLogger {
    logError(error: Error | AppError): void;
    logValidationError(error: ValidationError): void;
    logUnauthorized(error: UnauthorizedError): void;
}
declare const _default: {
    AppError: typeof AppError;
    ValidationError: typeof ValidationError;
    UnauthorizedError: typeof UnauthorizedError;
    ForbiddenError: typeof ForbiddenError;
    NotFoundError: typeof NotFoundError;
    ConflictError: typeof ConflictError;
    TooManyRequestsError: typeof TooManyRequestsError;
    BadGatewayError: typeof BadGatewayError;
};
export default _default;
//# sourceMappingURL=error.types.d.ts.map