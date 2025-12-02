"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOAuthErrors = exports.logOAuthActivity = exports.refreshOAuthTokenIfNeeded = exports.requireOAuthAccount = exports.validateOAuthAccessToken = exports.ensureOAuthAccountExists = exports.verifyOAuthState = void 0;
const logger_1 = require("../utils/logger");
const oauth_helper_1 = require("../utils/oauth.helper");
const google_oauth_service_1 = __importDefault(require("../services/google-oauth.service"));
const oauth_service_1 = __importDefault(require("../services/oauth.service"));
/**
 * Verify OAuth state token
 */
const verifyOAuthState = (req, res, next) => {
    try {
        const { state, provider } = req.query;
        if (!state || !provider) {
            logger_1.logger.warn('Missing OAuth state or provider');
            res.status(400).json({
                success: false,
                error: 'Missing OAuth state or provider'
            });
            return;
        }
        const validatedState = (0, oauth_helper_1.validateStateToken)(state, provider);
        if (!validatedState) {
            logger_1.logger.warn('Invalid or expired OAuth state token');
            res.status(400).json({
                success: false,
                error: 'Invalid or expired OAuth state'
            });
            return;
        }
        // Attach state to request
        req.oauthState = validatedState;
        next();
    }
    catch (error) {
        logger_1.logger.error('OAuth state verification error:', error);
        res.status(500).json({
            success: false,
            error: 'OAuth state verification failed'
        });
    }
};
exports.verifyOAuthState = verifyOAuthState;
/**
 * Ensure OAuth account exists
 */
const ensureOAuthAccountExists = async (req, res, next) => {
    try {
        const { provider } = req.params;
        const userId = req.user?.userId;
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
        const oauthAccount = await oauth_service_1.default.getOAuthAccount(userId, provider);
        if (!oauthAccount) {
            res.status(404).json({
                success: false,
                error: `${provider} account not found`
            });
            return;
        }
        // Attach account to request
        req.oauthAccount = oauthAccount;
        next();
    }
    catch (error) {
        logger_1.logger.error('OAuth account check error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify OAuth account'
        });
    }
};
exports.ensureOAuthAccountExists = ensureOAuthAccountExists;
/**
 * Validate OAuth access token
 */
const validateOAuthAccessToken = async (req, res, next) => {
    try {
        const { provider } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }
        const oauthAccount = await oauth_service_1.default.getOAuthAccount(userId, provider);
        if (!oauthAccount) {
            res.status(404).json({
                success: false,
                error: `${provider} account not found`
            });
            return;
        }
        // Validate access token (for Google)
        if (provider === 'google' && oauthAccount.accessToken) {
            const isValid = await google_oauth_service_1.default.validateAccessToken(oauthAccount.accessToken);
            if (!isValid) {
                logger_1.logger.warn(`Invalid ${provider} access token for user`);
                res.status(401).json({
                    success: false,
                    error: `${provider} access token is invalid or expired`
                });
                return;
            }
        }
        // Attach account to request
        req.oauthAccount = oauthAccount;
        next();
    }
    catch (error) {
        logger_1.logger.error('OAuth access token validation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to validate OAuth access token'
        });
    }
};
exports.validateOAuthAccessToken = validateOAuthAccessToken;
/**
 * Check if user has OAuth account
 */
const requireOAuthAccount = (provider) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }
            const hasAccount = await oauth_service_1.default.isOAuthAccountLinked(userId, provider);
            if (!hasAccount) {
                res.status(403).json({
                    success: false,
                    error: `${provider} account is not linked`
                });
                return;
            }
            next();
        }
        catch (error) {
            logger_1.logger.error('OAuth requirement check error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to check OAuth account requirement'
            });
        }
    };
};
exports.requireOAuthAccount = requireOAuthAccount;
/**
 * Refresh OAuth token if needed
 */
const refreshOAuthTokenIfNeeded = (provider) => {
    return async (req, _res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next();
            }
            const oauthAccount = await oauth_service_1.default.getOAuthAccount(userId, provider);
            if (!oauthAccount) {
                return next();
            }
            // Check if token refresh is needed (for Google)
            if (provider === 'google' && oauthAccount.refreshToken) {
                // In a real scenario, check token expiry and refresh if needed
                // For now, just log
                logger_1.logger.debug(`OAuth token refresh check for ${provider}`);
            }
            // Attach account to request
            req.oauthAccount = oauthAccount;
            next();
        }
        catch (error) {
            logger_1.logger.error('OAuth token refresh error:', error);
            // Don't fail request, just continue
            next();
        }
    };
};
exports.refreshOAuthTokenIfNeeded = refreshOAuthTokenIfNeeded;
/**
 * Log OAuth activity
 */
const logOAuthActivity = (_req, _res, next) => {
    const userId = _req.user?.userId || 'anonymous';
    const provider = _req.params.provider || 'unknown';
    logger_1.logger.info(`OAuth Activity: ${_req.method} ${_req.path}`, {
        userId,
        provider,
        timestamp: new Date().toISOString()
    });
    next();
};
exports.logOAuthActivity = logOAuthActivity;
/**
 * Handle OAuth errors gracefully
 */
const handleOAuthErrors = (error, _req, res, _next) => {
    logger_1.logger.error('OAuth error:', error);
    if (error.code === 'access_denied') {
        res.status(403).json({
            success: false,
            error: 'OAuth access was denied'
        });
    }
    else if (error.code === 'invalid_grant') {
        res.status(400).json({
            success: false,
            error: 'OAuth grant is invalid or expired'
        });
    }
    else if (error.code === 'invalid_client') {
        res.status(400).json({
            success: false,
            error: 'OAuth client configuration is invalid'
        });
    }
    else {
        res.status(500).json({
            success: false,
            error: 'OAuth authentication failed'
        });
    }
};
exports.handleOAuthErrors = handleOAuthErrors;
//# sourceMappingURL=oauth.middleware.js.map