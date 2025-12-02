/// <reference types="qs" />
import { Request, Response, NextFunction } from 'express';
/**
 * Check if user has required role
 */
export declare const authorize: (allowedRoles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Check if user is admin
 */
export declare const isAdmin: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Check if user is student
 */
export declare const isStudent: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Check if user owns the resource
 */
export declare const isResourceOwner: (userIdParam?: string) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Verify request body includes required fields
 */
export declare const requireFields: (fields: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
declare const _default: {
    authorize: (allowedRoles: string[]) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
    isAdmin: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
    isStudent: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
    isResourceOwner: (userIdParam?: string) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
    requireFields: (fields: string[]) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>>, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=authorization.d.ts.map