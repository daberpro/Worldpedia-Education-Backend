import { OAuthProviderConfig } from '../types/oauth.types';
/**
 * Google OAuth Configuration
 */
export declare const googleOAuthConfig: OAuthProviderConfig;
/**
 * Verify Google OAuth Configuration
 */
export declare const verifyGoogleOAuthConfig: () => void;
/**
 * Get Google OAuth Scopes
 */
export declare const getGoogleScopes: () => string[];
/**
 * Build Google Auth URL
 */
export declare const buildGoogleAuthUrl: (state: string) => string;
/**
 * Exchange authorization code for tokens
 */
export declare const exchangeCodeForTokens: (code: string) => Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    id_token?: string;
}>;
/**
 * Fetch Google User Info
 */
export declare const fetchGoogleUserInfo: (accessToken: string) => Promise<any>;
/**
 * Refresh Google Access Token
 */
export declare const refreshGoogleAccessToken: (refreshToken: string) => Promise<{
    access_token: string;
    expires_in: number;
    token_type: string;
}>;
/**
 * Revoke Google Access Token
 */
export declare const revokeGoogleAccessToken: (accessToken: string) => Promise<void>;
//# sourceMappingURL=google-oauth.config.d.ts.map