/// <reference types="qs" />
import { Request, Response, NextFunction } from 'express';
/**
 * Extend Express Request with user context
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                username: string;
                role: 'student' | 'admin';
            };
        }
    }
}
/**
 * JWT Authentication Middleware
 */
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Optional Authentication Middleware
 * Doesn't fail if no token provided, just sets user to undefined
 */
export declare const optionalAuth: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Verify user is authenticated
 */
export declare const ensureAuthenticated: (req: Request, _res: Response, next: NextFunction) => void;
declare const _default: {
    authenticate: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
    optionalAuth: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
    ensureAuthenticated: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map