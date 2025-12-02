"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeGoogleAccessToken = exports.refreshGoogleAccessToken = exports.fetchGoogleUserInfo = exports.exchangeCodeForTokens = exports.buildGoogleAuthUrl = exports.getGoogleScopes = exports.verifyGoogleOAuthConfig = exports.googleOAuthConfig = void 0;
const env_1 = __importDefault(require("./env"));
const logger_1 = require("../utils/logger");
/**
 * Google OAuth Configuration
 */
exports.googleOAuthConfig = {
    clientID: env_1.default.google.clientId || '',
    clientSecret: env_1.default.google.clientSecret || '',
    callbackURL: env_1.default.google.callbackUrl || 'http://localhost:3000/api/oauth/google/callback',
    scope: [
        'profile',
        'email',
        'openid'
    ],
    passReqToCallback: true,
    accessType: 'offline',
    prompt: 'consent'
};
/**
 * Verify Google OAuth Configuration
 */
const verifyGoogleOAuthConfig = () => {
    try {
        if (!exports.googleOAuthConfig.clientID) {
            throw new Error('GOOGLE_CLIENT_ID is not configured');
        }
        if (!exports.googleOAuthConfig.clientSecret) {
            throw new Error('GOOGLE_CLIENT_SECRET is not configured');
        }
        if (!exports.googleOAuthConfig.callbackURL) {
            throw new Error('GOOGLE_CALLBACK_URL is not configured');
        }
        logger_1.logger.info('✅ Google OAuth configuration verified');
        logger_1.logger.info(`   Client ID: ${exports.googleOAuthConfig.clientID.substring(0, 10)}...`);
        logger_1.logger.info(`   Callback URL: ${exports.googleOAuthConfig.callbackURL}`);
    }
    catch (error) {
        logger_1.logger.error('❌ Google OAuth configuration error:', error.message);
        throw error;
    }
};
exports.verifyGoogleOAuthConfig = verifyGoogleOAuthConfig;
/**
 * Get Google OAuth Scopes
 */
const getGoogleScopes = () => {
    return exports.googleOAuthConfig.scope || ['profile', 'email', 'openid'];
};
exports.getGoogleScopes = getGoogleScopes;
/**
 * Build Google Auth URL
 */
const buildGoogleAuthUrl = (state) => {
    const params = new URLSearchParams({
        client_id: exports.googleOAuthConfig.clientID,
        redirect_uri: exports.googleOAuthConfig.callbackURL,
        response_type: 'code',
        scope: (exports.googleOAuthConfig.scope || []).join(' '),
        state: state,
        access_type: exports.googleOAuthConfig.accessType || 'offline',
        prompt: exports.googleOAuthConfig.prompt || 'consent'
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};
exports.buildGoogleAuthUrl = buildGoogleAuthUrl;
/**
 * Exchange authorization code for tokens
 */
const exchangeCodeForTokens = async (code) => {
    try {
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const params = new URLSearchParams({
            code,
            client_id: exports.googleOAuthConfig.clientID,
            client_secret: exports.googleOAuthConfig.clientSecret,
            redirect_uri: exports.googleOAuthConfig.callbackURL,
            grant_type: 'authorization_code'
        });
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Token exchange failed: ${errorData?.error_description || errorData?.error || 'Unknown error'}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        logger_1.logger.error('Failed to exchange code for tokens:', error);
        throw error;
    }
};
exports.exchangeCodeForTokens = exchangeCodeForTokens;
/**
 * Fetch Google User Info
 */
const fetchGoogleUserInfo = async (accessToken) => {
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch Google user info');
        }
        return await response.json();
    }
    catch (error) {
        logger_1.logger.error('Failed to fetch Google user info:', error);
        throw error;
    }
};
exports.fetchGoogleUserInfo = fetchGoogleUserInfo;
/**
 * Refresh Google Access Token
 */
const refreshGoogleAccessToken = async (refreshToken) => {
    try {
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const params = new URLSearchParams({
            refresh_token: refreshToken,
            client_id: exports.googleOAuthConfig.clientID,
            client_secret: exports.googleOAuthConfig.clientSecret,
            grant_type: 'refresh_token'
        });
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Token refresh failed: ${errorData?.error_description || errorData?.error || 'Unknown error'}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        logger_1.logger.error('Failed to refresh access token:', error);
        throw error;
    }
};
exports.refreshGoogleAccessToken = refreshGoogleAccessToken;
/**
 * Revoke Google Access Token
 */
const revokeGoogleAccessToken = async (accessToken) => {
    try {
        const revokeUrl = 'https://oauth2.googleapis.com/revoke';
        const params = new URLSearchParams({
            token: accessToken
        });
        await fetch(revokeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        logger_1.logger.info('✅ Google access token revoked');
    }
    catch (error) {
        logger_1.logger.error('Failed to revoke access token:', error);
        throw error;
    }
};
exports.revokeGoogleAccessToken = revokeGoogleAccessToken;
//# sourceMappingURL=google-oauth.config.js.map