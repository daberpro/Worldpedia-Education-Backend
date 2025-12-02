/// <reference types="node" />
/// <reference types="qs" />
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
/**
 * CORS Configuration
 */
export declare const corsMiddleware: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
/**
 * Helmet Security Headers
 */
export declare const helmetMiddleware: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, next: (err?: unknown) => void) => void;
/**
 * Remove X-Powered-By header
 */
export declare const removePoweredBy: (_req: Request, res: Response, next: NextFunction) => void;
/**
 * Request logging middleware
 */
export declare const requestLogger: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Request body sanitization
 */
export declare const sanitizeInput: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Response security headers
 */
export declare const responseHeaders: (_req: Request, res: Response, next: NextFunction) => void;
/**
 * API version middleware
 */
export declare const apiVersion: (_req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    corsMiddleware: (req: cors.CorsRequest, res: {
        statusCode?: number | undefined;
        setHeader(key: string, value: string): any;
        end(): any;
    }, next: (err?: any) => any) => void;
    helmetMiddleware: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, next: (err?: unknown) => void) => void;
    removePoweredBy: (_req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
    requestLogger: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
    sanitizeInput: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
    responseHeaders: (_req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
    apiVersion: (_req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=security.d.ts.map