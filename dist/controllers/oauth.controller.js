"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthController = void 0;
const logger_1 = require("../utils/logger");
const google_oauth_service_1 = __importDefault(require("../services/google-oauth.service"));
const oauth_service_1 = __importDefault(require("../services/oauth.service"));
const google_oauth_config_1 = require("../config/google-oauth.config");
const oauth_helper_1 = require("../utils/oauth.helper");
const oauth_types_1 = require("../types/oauth.types");
class OAuthController {
    /**
     * Initiate Google OAuth login
     */
    async googleLogin(_req, res) {
        try {
            const state = (0, oauth_helper_1.generateStateToken)('google');
            const authUrl = (0, google_oauth_config_1.buildGoogleAuthUrl)(state);
            logger_1.logger.info('✅ Google OAuth login initiated');
            res.json({
                success: true,
                message: 'Google OAuth authentication initiated',
                data: {
                    authUrl,
                    state
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to initiate Google login:', error);
            res.status(500).json(google_oauth_service_1.default.formatErrorResponse(error));
        }
    }
    /**
     * Google OAuth callback handler
     */
    async googleCallback(req, res) {
        try {
            const { code, state } = req.query;
            if (!code || !state) {
                throw new Error('Missing authorization code or state');
            }
            // Handle Google OAuth callback
            const { googleData, oauthState } = await google_oauth_service_1.default.handleGoogleCallback(code, state, 'google');
            // Check if user already exists by email or OAuth ID
            const existingUserId = await oauth_service_1.default.findUserByOAuthAccount('google', googleData.id);
            if (existingUserId && !oauthState.linkingMode) {
                // User already has this Google account linked
                logger_1.logger.info('✅ Google OAuth callback successful - existing user');
                res.json({
                    success: true,
                    message: 'Google OAuth authentication successful',
                    data: {
                        userId: existingUserId,
                        email: googleData.email,
                        displayName: googleData.displayName,
                        redirectUrl: '/dashboard'
                    }
                });
            }
            else if (oauthState.linkingMode && oauthState.userId) {
                // Linking mode - attach to existing user account
                await oauth_service_1.default.linkOAuthAccount(oauthState.userId, 'google', googleData);
                logger_1.logger.info('✅ Google OAuth linked to user account');
                res.json({
                    success: true,
                    message: 'Google account linked successfully',
                    data: {
                        userId: oauthState.userId,
                        linkedAccounts: await oauth_service_1.default.getLinkedAccounts(oauthState.userId),
                        redirectUrl: '/settings/accounts'
                    }
                });
            }
            else {
                // New user registration via Google
                logger_1.logger.info('✅ Google OAuth callback successful - new user');
                res.json({
                    success: true,
                    message: 'Google OAuth authentication successful - new user',
                    data: {
                        email: googleData.email,
                        displayName: googleData.displayName,
                        picture: googleData.picture,
                        redirectUrl: '/register/complete'
                    }
                });
            }
        }
        catch (error) {
            logger_1.logger.error('Google OAuth callback error:', error);
            res.status(400).json(google_oauth_service_1.default.formatErrorResponse(error));
        }
    }
    /**
     * Link Google account to authenticated user
     */
    async linkGoogleAccount(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }
            // Check if already linked
            const isLinked = await oauth_service_1.default.isOAuthAccountLinked(userId, 'google');
            if (isLinked) {
                res.status(400).json({
                    success: false,
                    error: 'Google account is already linked'
                });
                return;
            }
            // Generate state token for linking mode
            const state = (0, oauth_helper_1.generateStateToken)('google', userId, true);
            const authUrl = (0, google_oauth_config_1.buildGoogleAuthUrl)(state);
            logger_1.logger.info('✅ Google linking initiated');
            res.json({
                success: true,
                message: 'Google linking initiated',
                data: {
                    authUrl,
                    state
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to initiate Google linking:', error);
            res.status(500).json({
                success: false,
                error: (0, oauth_helper_1.sanitizeOAuthError)(error)
            });
        }
    }
    /**
     * Get linked OAuth accounts
     */
    async getLinkedAccounts(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }
            const response = await oauth_service_1.default.getLinkedAccountsWithStatus(userId);
            logger_1.logger.info('✅ Retrieved linked accounts');
            res.json(response);
        }
        catch (error) {
            logger_1.logger.error('Failed to get linked accounts:', error);
            res.status(500).json({
                success: false,
                error: (0, oauth_helper_1.sanitizeOAuthError)(error)
            });
        }
    }
    /**
     * Unlink OAuth account
     */
    async unlinkOAuthAccount(req, res) {
        try {
            const userId = req.user?.userId;
            const { provider } = req.params;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }
            if (!provider) {
                res.status(400).json({
                    success: false,
                    error: 'Provider is required'
                });
                return;
            }
            // Check if user has multiple linked accounts
            const linkedAccounts = await oauth_service_1.default.getLinkedAccounts(userId);
            if (linkedAccounts.length <= 1) {
                res.status(400).json({
                    success: false,
                    error: 'Cannot unlink the only linked account'
                });
                return;
            }
            const response = await oauth_service_1.default.unlinkOAuthAccount(userId, provider);
            logger_1.logger.info(`✅ Unlinked OAuth account: ${provider}`);
            res.json(response);
        }
        catch (error) {
            logger_1.logger.error('Failed to unlink OAuth account:', error);
            res.status(500).json({
                success: false,
                error: (0, oauth_helper_1.sanitizeOAuthError)(error)
            });
        }
    }
    /**
     * Refresh OAuth token
     */
    async refreshOAuthToken(req, res) {
        try {
            const userId = req.user?.userId;
            const { provider } = req.body;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }
            if (!provider) {
                res.status(400).json({
                    success: false,
                    error: 'Provider is required'
                });
                return;
            }
            const account = await oauth_service_1.default.getOAuthAccount(userId, provider);
            if (!account) {
                res.status(400).json({
                    success: false,
                    error: `${provider} account not linked`
                });
                return;
            }
            if (!account.refreshToken) {
                res.status(400).json({
                    success: false,
                    error: `${provider} account has no refresh token`
                });
                return;
            }
            const newTokenData = await google_oauth_service_1.default.refreshAccessToken(account.refreshToken);
            // Update stored tokens
            await oauth_service_1.default.updateOAuthAccountData(userId, provider, {
                accessToken: newTokenData.accessToken,
                refreshToken: newTokenData.refreshToken
            });
            logger_1.logger.info(`✅ Refreshed ${provider} token for user`);
            res.json({
                success: true,
                message: `${provider} token refreshed successfully`,
                data: {
                    provider,
                    accessToken: newTokenData.accessToken
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to refresh OAuth token:', error);
            res.status(500).json({
                success: false,
                error: (0, oauth_helper_1.sanitizeOAuthError)(error)
            });
        }
    }
    /**
     * Get available OAuth providers
     */
    async getOAuthProviders(_req, res) {
        try {
            const providers = [
                {
                    name: 'Google',
                    id: oauth_types_1.OAuthProvider.GOOGLE,
                    icon: 'google',
                    enabled: true
                }
            ];
            logger_1.logger.info('✅ Retrieved OAuth providers');
            res.json({
                success: true,
                providers
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to get OAuth providers:', error);
            res.status(500).json({
                success: false,
                error: (0, oauth_helper_1.sanitizeOAuthError)(error)
            });
        }
    }
    /**
     * Disconnect all OAuth accounts
     */
    async disconnectAllOAuth(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }
            await oauth_service_1.default.disconnectAllOAuthAccounts(userId);
            logger_1.logger.info('✅ Disconnected all OAuth accounts');
            res.json({
                success: true,
                message: 'All OAuth accounts disconnected successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to disconnect OAuth accounts:', error);
            res.status(500).json({
                success: false,
                error: (0, oauth_helper_1.sanitizeOAuthError)(error)
            });
        }
    }
}
exports.OAuthController = OAuthController;
exports.default = new OAuthController();
//# sourceMappingURL=oauth.controller.js.map