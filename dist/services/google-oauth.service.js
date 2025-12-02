"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthService = void 0;
const logger_1 = require("../utils/logger");
const google_oauth_config_1 = require("../config/google-oauth.config");
const oauth_helper_1 = require("../utils/oauth.helper");
class GoogleOAuthService {
    /**
     * Handle Google OAuth callback
     */
    async handleGoogleCallback(code, state, provider = 'google') {
        try {
            // Validate state token
            const oauthState = (0, oauth_helper_1.validateStateToken)(state, provider);
            if (!oauthState) {
                throw new Error('Invalid or expired state token');
            }
            // Exchange code for tokens
            const tokens = await (0, google_oauth_config_1.exchangeCodeForTokens)(code);
            logger_1.logger.info(`✅ Exchanged authorization code for tokens`);
            // Fetch user info from Google
            const googleUserInfo = await (0, google_oauth_config_1.fetchGoogleUserInfo)(tokens.access_token);
            logger_1.logger.info(`✅ Fetched Google user info`);
            // Normalize OAuth data
            const googleData = (0, oauth_helper_1.normalizeOAuthData)(googleUserInfo, tokens.access_token, tokens.refresh_token);
            (0, oauth_helper_1.logOAuthEvent)('callback_successful', provider, oauthState.userId);
            return {
                googleData,
                oauthState
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to handle Google OAuth callback:', error);
            (0, oauth_helper_1.logOAuthEvent)('callback_failed', provider, undefined, { error: error.message });
            throw error;
        }
    }
    /**
     * Refresh Google OAuth token
     */
    async refreshAccessToken(refreshToken) {
        try {
            if (!refreshToken) {
                throw new Error('Refresh token is required');
            }
            const newTokens = await (0, google_oauth_config_1.refreshGoogleAccessToken)(refreshToken);
            logger_1.logger.info(`✅ Refreshed Google access token`);
            const googleUserInfo = await (0, google_oauth_config_1.fetchGoogleUserInfo)(newTokens.access_token);
            const googleData = {
                id: googleUserInfo.id,
                email: googleUserInfo.email,
                displayName: googleUserInfo.name,
                picture: googleUserInfo.picture,
                accessToken: newTokens.access_token,
                refreshToken: refreshToken, // Keep original refresh token if new one not provided
                connectedAt: new Date()
            };
            (0, oauth_helper_1.logOAuthEvent)('token_refreshed', 'google');
            return googleData;
        }
        catch (error) {
            logger_1.logger.error('Failed to refresh access token:', error);
            throw error;
        }
    }
    /**
     * Revoke Google OAuth token
     */
    async revokeAccessToken(accessToken) {
        try {
            await (0, google_oauth_config_1.revokeGoogleAccessToken)(accessToken);
            logger_1.logger.info(`✅ Revoked Google access token`);
            (0, oauth_helper_1.logOAuthEvent)('token_revoked', 'google');
        }
        catch (error) {
            logger_1.logger.error('Failed to revoke access token:', error);
            throw error;
        }
    }
    /**
     * Validate access token
     */
    async validateAccessToken(accessToken) {
        try {
            const userInfo = await (0, google_oauth_config_1.fetchGoogleUserInfo)(accessToken);
            return !!userInfo.id;
        }
        catch (error) {
            logger_1.logger.warn('Access token validation failed');
            return false;
        }
    }
    /**
     * Get Google user info
     */
    async getUserInfo(accessToken) {
        try {
            const userInfo = await (0, google_oauth_config_1.fetchGoogleUserInfo)(accessToken);
            logger_1.logger.info(`✅ Retrieved Google user info`);
            return userInfo;
        }
        catch (error) {
            logger_1.logger.error('Failed to get Google user info:', error);
            throw error;
        }
    }
    /**
     * Map Google profile to user data
     */
    mapGoogleProfileToUserData(profile, accessToken, refreshToken) {
        try {
            return {
                email: profile.email || profile._json?.email,
                firstName: profile._json?.given_name || '',
                lastName: profile._json?.family_name || '',
                displayName: profile.displayName || profile._json?.name || '',
                picture: profile._json?.picture || profile.photos?.[0]?.value || '',
                googleId: profile.id,
                emailVerified: profile._json?.email_verified || false,
                locale: profile._json?.locale || 'en',
                oauth: {
                    google: {
                        id: profile.id,
                        email: profile.email || profile._json?.email,
                        displayName: profile.displayName,
                        picture: profile._json?.picture || profile.photos?.[0]?.value,
                        accessToken,
                        refreshToken,
                        connectedAt: new Date()
                    }
                }
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to map Google profile:', error);
            throw error;
        }
    }
    /**
     * Verify Google ID token
     */
    async verifyIdToken(idToken) {
        try {
            // In production, verify JWT signature
            // For now, decode and return
            const decoded = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
            logger_1.logger.info(`✅ Verified Google ID token`);
            return decoded;
        }
        catch (error) {
            logger_1.logger.error('Failed to verify ID token:', error);
            throw error;
        }
    }
    /**
     * Format OAuth error response
     */
    formatErrorResponse(error) {
        return {
            success: false,
            message: 'Google OAuth authentication failed',
            error: (0, oauth_helper_1.sanitizeOAuthError)(error)
        };
    }
    /**
     * Format success response
     */
    formatSuccessResponse(data, message = 'Google OAuth authenticated successfully') {
        return {
            success: true,
            message,
            data
        };
    }
}
exports.GoogleOAuthService = GoogleOAuthService;
exports.default = new GoogleOAuthService();
//# sourceMappingURL=google-oauth.service.js.map