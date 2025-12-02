import { Request, Response, NextFunction } from 'express';
/**
 * Verify OAuth state token
 */
export declare const verifyOAuthState: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Ensure OAuth account exists
 */
export declare const ensureOAuthAccountExists: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Validate OAuth access token
 */
export declare const validateOAuthAccessToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Check if user has OAuth account
 */
export declare const requireOAuthAccount: (provider: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Refresh OAuth token if needed
 */
export declare const refreshOAuthTokenIfNeeded: (provider: string) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
/**
 * Log OAuth activity
 */
export declare const logOAuthActivity: (_req: Request, _res: Response, next: NextFunction) => void;
/**
 * Handle OAuth errors gracefully
 */
export declare const handleOAuthErrors: (error: any, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=oauth.middleware.d.ts.map