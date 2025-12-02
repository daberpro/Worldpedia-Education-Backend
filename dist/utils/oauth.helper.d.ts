import { OAuthState } from '../types/oauth.types';
/**
 * Generate random state token for CSRF protection
 */
export declare const generateStateToken: (provider: string, userId?: string, linkingMode?: boolean) => string;
/**
 * Decode and validate state token
 */
export declare const validateStateToken: (encodedState: string, provider: string) => OAuthState | null;
/**
 * Extract email from OAuth profile
 */
export declare const extractEmailFromProfile: (profile: any) => string | null;
/**
 * Extract display name from OAuth profile
 */
export declare const extractDisplayNameFromProfile: (profile: any) => string;
/**
 * Extract picture from OAuth profile
 */
export declare const extractPictureFromProfile: (profile: any) => string | null;
/**
 * Extract provider ID from OAuth profile
 */
export declare const extractProviderId: (profile: any) => string | null;
/**
 * Build redirect URL after OAuth
 */
export declare const buildRedirectUrl: (baseUrl: string, params: Record<string, string>) => string;
/**
 * Normalize OAuth account data
 */
export declare const normalizeOAuthData: (profile: any, accessToken: string, refreshToken?: string) => {
    id: string;
    email: string;
    displayName: string;
    picture: string | null;
    accessToken: string;
    refreshToken: string | undefined;
    connectedAt: Date;
};
/**
 * Validate OAuth provider
 */
export declare const isValidOAuthProvider: (provider: string) => boolean;
/**
 * Check if email is already used
 */
export declare const isEmailRegistered: (email: string, existingEmail?: string) => boolean;
/**
 * Generate OAuth linking URL
 */
export declare const generateOAuthLinkingUrl: (provider: string, state: string) => string;
/**
 * Generate token expiry time
 */
export declare const calculateTokenExpiry: (expiresIn: number) => Date;
/**
 * Check if token is expired
 */
export declare const isTokenExpired: (expiresAt?: Date) => boolean;
/**
 * Sanitize OAuth error messages
 */
export declare const sanitizeOAuthError: (error: any) => string;
/**
 * Log OAuth event
 */
export declare const logOAuthEvent: (event: string, provider: string, userId?: string, details?: Record<string, any>) => void;
/**
 * Validate OAuth response
 */
export declare const validateOAuthResponse: (response: any) => boolean;
//# sourceMappingURL=oauth.helper.d.ts.map