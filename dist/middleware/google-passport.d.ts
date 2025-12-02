/**
 * Configure Passport Google Strategy
 */
export declare const configureGooglePassport: () => void;
/**
 * Serialize user for session
 */
export declare const serializeUser: () => void;
/**
 * Deserialize user from session
 */
export declare const deserializeUser: () => void;
/**
 * Initialize Passport
 */
export declare const initializePassport: () => void;
/**
 * Google authentication middleware
 */
export declare const authenticateGoogle: any;
/**
 * Google callback middleware
 */
export declare const googleCallback: any;
/**
 * Check if user is authenticated
 */
export declare const isAuthenticated: (req: any, res: any, next: any) => void;
/**
 * Check if user is authenticated with specific OAuth provider
 */
export declare const isAuthenticatedWithProvider: (provider: string) => (req: any, res: any, next: any) => void;
//# sourceMappingURL=google-passport.d.ts.map