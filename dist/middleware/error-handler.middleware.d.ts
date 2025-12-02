import { Request, Response, NextFunction } from 'express';
/**
 * Custom Error Interface
 */
interface CustomError extends Error {
    status?: number;
    code?: string;
}
/**
 * Global Error Handler Middleware
 * Should be placed at the end of all routes and middleware
 */
export declare const errorHandler: (error: CustomError, _req: Request, res: Response, _next: NextFunction) => Response;
export default errorHandler;
//# sourceMappingURL=error-handler.middleware.d.ts.map