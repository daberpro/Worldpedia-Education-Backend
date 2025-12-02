/// <reference types="qs" />
/// <reference types="express" />
import multer from 'multer';
/**
 * Multer configuration
 */
export declare const uploadMiddleware: multer.Multer;
/**
 * Single file upload middleware
 */
export declare const uploadSingleMiddleware: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Multiple files upload middleware
 */
export declare const uploadMultipleMiddleware: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Error handling for multer
 */
export declare const handleUploadError: (error: any, _req: any, res: any, next: any) => any;
//# sourceMappingURL=upload.middleware.d.ts.map