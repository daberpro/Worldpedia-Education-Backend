"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOAuthResponse = exports.logOAuthEvent = exports.sanitizeOAuthError = exports.isTokenExpired = exports.calculateTokenExpiry = exports.generateOAuthLinkingUrl = exports.isEmailRegistered = exports.isValidOAuthProvider = exports.normalizeOAuthData = exports.buildRedirectUrl = exports.extractProviderId = exports.extractPictureFromProfile = exports.extractDisplayNameFromProfile = exports.extractEmailFromProfile = exports.validateStateToken = exports.generateStateToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("./logger");
/**
 * Generate random state token for CSRF protection
 */
const generateStateToken = (provider, userId, linkingMode = false) => {
    try {
        const state = {
            state: crypto_1.default.randomBytes(32).toString('hex'),
            timestamp: Date.now(),
            provider,
            userId,
            linkingMode
        };
        // Encode state as base64 JSON
        const encodedState = Buffer.from(JSON.stringify(state)).toString('base64');
        logger_1.logger.info(`✅ Generated OAuth state token for ${provider}`);
        return encodedState;
    }
    catch (error) {
        logger_1.logger.error('Failed to generate state token:', error);
        throw error;
    }
};
exports.generateStateToken = generateStateToken;
/**
 * Decode and validate state token
 */
const validateStateToken = (encodedState, provider) => {
    try {
        const decodedState = Buffer.from(encodedState, 'base64').toString('utf-8');
        const state = JSON.parse(decodedState);
        // Validate state structure
        if (!state.state || !state.timestamp || state.provider !== provider) {
            logger_1.logger.warn('Invalid state token structure');
            return null;
        }
        // Check if state is not older than 10 minutes
        const stateAge = (Date.now() - state.timestamp) / 1000 / 60; // in minutes
        if (stateAge > 10) {
            logger_1.logger.warn('State token expired');
            return null;
        }
        logger_1.logger.info(`✅ State token validated for ${provider}`);
        return state;
    }
    catch (error) {
        logger_1.logger.error('Failed to validate state token:', error);
        return null;
    }
};
exports.validateStateToken = validateStateToken;
/**
 * Extract email from OAuth profile
 */
const extractEmailFromProfile = (profile) => {
    try {
        // Try multiple email sources
        if (profile.emails && profile.emails.length > 0) {
            return profile.emails[0].value;
        }
        if (profile._json?.email) {
            return profile._json.email;
        }
        if (profile.email) {
            return profile.email;
        }
        return null;
    }
    catch (error) {
        logger_1.logger.error('Failed to extract email from profile:', error);
        return null;
    }
};
exports.extractEmailFromProfile = extractEmailFromProfile;
/**
 * Extract display name from OAuth profile
 */
const extractDisplayNameFromProfile = (profile) => {
    try {
        // Try multiple name sources
        if (profile.displayName) {
            return profile.displayName;
        }
        if (profile._json?.name) {
            return profile._json.name;
        }
        if (profile.name) {
            const { givenName, familyName } = profile.name;
            return `${givenName || ''} ${familyName || ''}`.trim();
        }
        return 'User';
    }
    catch (error) {
        logger_1.logger.error('Failed to extract display name:', error);
        return 'User';
    }
};
exports.extractDisplayNameFromProfile = extractDisplayNameFromProfile;
/**
 * Extract picture from OAuth profile
 */
const extractPictureFromProfile = (profile) => {
    try {
        // Try multiple picture sources
        if (profile.photos && profile.photos.length > 0) {
            return profile.photos[0].value;
        }
        if (profile._json?.picture) {
            return profile._json.picture;
        }
        if (profile.picture) {
            return profile.picture;
        }
        return null;
    }
    catch (error) {
        logger_1.logger.error('Failed to extract picture:', error);
        return null;
    }
};
exports.extractPictureFromProfile = extractPictureFromProfile;
/**
 * Extract provider ID from OAuth profile
 */
const extractProviderId = (profile) => {
    try {
        if (profile.id) {
            return profile.id;
        }
        if (profile._json?.sub) {
            return profile._json.sub;
        }
        return null;
    }
    catch (error) {
        logger_1.logger.error('Failed to extract provider ID:', error);
        return null;
    }
};
exports.extractProviderId = extractProviderId;
/**
 * Build redirect URL after OAuth
 */
const buildRedirectUrl = (baseUrl, params) => {
    try {
        const url = new URL(baseUrl);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        return url.toString();
    }
    catch (error) {
        logger_1.logger.error('Failed to build redirect URL:', error);
        return baseUrl;
    }
};
exports.buildRedirectUrl = buildRedirectUrl;
/**
 * Normalize OAuth account data
 */
const normalizeOAuthData = (profile, accessToken, refreshToken) => {
    try {
        const email = (0, exports.extractEmailFromProfile)(profile);
        const displayName = (0, exports.extractDisplayNameFromProfile)(profile);
        const picture = (0, exports.extractPictureFromProfile)(profile);
        const providerId = (0, exports.extractProviderId)(profile);
        if (!email || !providerId) {
            throw new Error('Missing required OAuth data');
        }
        return {
            id: providerId,
            email,
            displayName,
            picture,
            accessToken,
            refreshToken,
            connectedAt: new Date()
        };
    }
    catch (error) {
        logger_1.logger.error('Failed to normalize OAuth data:', error);
        throw error;
    }
};
exports.normalizeOAuthData = normalizeOAuthData;
/**
 * Validate OAuth provider
 */
const isValidOAuthProvider = (provider) => {
    const validProviders = ['google', 'github', 'facebook'];
    return validProviders.includes(provider.toLowerCase());
};
exports.isValidOAuthProvider = isValidOAuthProvider;
/**
 * Check if email is already used
 */
const isEmailRegistered = (email, existingEmail) => {
    // This will be called in service layer to check database
    // Return true if email exists and is different from current user's email
    return email !== existingEmail;
};
exports.isEmailRegistered = isEmailRegistered;
/**
 * Generate OAuth linking URL
 */
const generateOAuthLinkingUrl = (provider, state) => {
    switch (provider.toLowerCase()) {
        case 'google':
            return `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&response_type=code&scope=profile+email&state=${state}`;
        case 'github':
            return `https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&scope=user:email&state=${state}`;
        case 'facebook':
            return `https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&scope=email,public_profile&state=${state}`;
        default:
            throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
};
exports.generateOAuthLinkingUrl = generateOAuthLinkingUrl;
/**
 * Generate token expiry time
 */
const calculateTokenExpiry = (expiresIn) => {
    return new Date(Date.now() + expiresIn * 1000);
};
exports.calculateTokenExpiry = calculateTokenExpiry;
/**
 * Check if token is expired
 */
const isTokenExpired = (expiresAt) => {
    if (!expiresAt) {
        return false;
    }
    return new Date() > expiresAt;
};
exports.isTokenExpired = isTokenExpired;
/**
 * Sanitize OAuth error messages
 */
const sanitizeOAuthError = (error) => {
    if (typeof error === 'string') {
        return error;
    }
    if (error?.message) {
        return error.message;
    }
    if (error?.error_description) {
        return error.error_description;
    }
    return 'An error occurred during OAuth authentication';
};
exports.sanitizeOAuthError = sanitizeOAuthError;
/**
 * Log OAuth event
 */
const logOAuthEvent = (event, provider, userId, details) => {
    logger_1.logger.info(`OAuth Event: ${event}`, {
        provider,
        userId,
        timestamp: new Date().toISOString(),
        ...details
    });
};
exports.logOAuthEvent = logOAuthEvent;
/**
 * Validate OAuth response
 */
const validateOAuthResponse = (response) => {
    return (response &&
        typeof response === 'object' &&
        (response.access_token || response.token) &&
        response.token_type);
};
exports.validateOAuthResponse = validateOAuthResponse;
//# sourceMappingURL=oauth.helper.js.map