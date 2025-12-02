import { GoogleOAuthData, GoogleUserInfo, OAuthResponse, OAuthState } from '../types/oauth.types';
export declare class GoogleOAuthService {
    /**
     * Handle Google OAuth callback
     */
    handleGoogleCallback(code: string, state: string, provider?: string): Promise<{
        googleData: GoogleOAuthData;
        oauthState: OAuthState;
    }>;
    /**
     * Refresh Google OAuth token
     */
    refreshAccessToken(refreshToken: string): Promise<GoogleOAuthData>;
    /**
     * Revoke Google OAuth token
     */
    revokeAccessToken(accessToken: string): Promise<void>;
    /**
     * Validate access token
     */
    validateAccessToken(accessToken: string): Promise<boolean>;
    /**
     * Get Google user info
     */
    getUserInfo(accessToken: string): Promise<GoogleUserInfo>;
    /**
     * Map Google profile to user data
     */
    mapGoogleProfileToUserData(profile: any, accessToken: string, refreshToken?: string): {
        email: any;
        firstName: any;
        lastName: any;
        displayName: any;
        picture: any;
        googleId: any;
        emailVerified: any;
        locale: any;
        oauth: {
            google: {
                id: any;
                email: any;
                displayName: any;
                picture: any;
                accessToken: string;
                refreshToken: string | undefined;
                connectedAt: Date;
            };
        };
    };
    /**
     * Verify Google ID token
     */
    verifyIdToken(idToken: string): Promise<GoogleUserInfo>;
    /**
     * Format OAuth error response
     */
    formatErrorResponse(error: any): OAuthResponse;
    /**
     * Format success response
     */
    formatSuccessResponse(data: any, message?: string): OAuthResponse;
}
declare const _default: GoogleOAuthService;
export default _default;
//# sourceMappingURL=google-oauth.service.d.ts.map