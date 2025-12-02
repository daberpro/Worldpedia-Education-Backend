"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticatedWithProvider = exports.isAuthenticated = exports.googleCallback = exports.authenticateGoogle = exports.initializePassport = exports.deserializeUser = exports.serializeUser = exports.configureGooglePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const logger_1 = require("../utils/logger");
const google_oauth_config_1 = require("../config/google-oauth.config");
const oauth_helper_1 = require("../utils/oauth.helper");
/**
 * Configure Passport Google Strategy
 */
const configureGooglePassport = () => {
    try {
        passport_1.default.use(new passport_google_oauth20_1.Strategy({
            clientID: google_oauth_config_1.googleOAuthConfig.clientID,
            clientSecret: google_oauth_config_1.googleOAuthConfig.clientSecret,
            callbackURL: google_oauth_config_1.googleOAuthConfig.callbackURL,
            passReqToCallback: true
        }, async (_req, accessToken, refreshToken, profile, done) => {
            try {
                const email = (0, oauth_helper_1.extractEmailFromProfile)(profile);
                const displayName = (0, oauth_helper_1.extractDisplayNameFromProfile)(profile);
                const picture = (0, oauth_helper_1.extractPictureFromProfile)(profile);
                const providerId = (0, oauth_helper_1.extractProviderId)(profile);
                if (!email || !providerId) {
                    return done(new Error('Missing required profile information'));
                }
                // Create user object from Google profile
                const user = {
                    googleId: providerId,
                    email,
                    displayName,
                    picture,
                    provider: 'google',
                    profile: profile._json,
                    accessToken,
                    refreshToken
                };
                logger_1.logger.info(`✅ Google OAuth verified for ${email}`);
                (0, oauth_helper_1.logOAuthEvent)('passport_verified', 'google', undefined, { email });
                return done(null, user);
            }
            catch (error) {
                logger_1.logger.error('Google Passport strategy error:', error);
                (0, oauth_helper_1.logOAuthEvent)('passport_error', 'google', undefined, { error: error.message });
                return done(error);
            }
        }));
        logger_1.logger.info('✅ Google Passport strategy configured');
    }
    catch (error) {
        logger_1.logger.error('Failed to configure Google Passport strategy:', error);
        throw error;
    }
};
exports.configureGooglePassport = configureGooglePassport;
/**
 * Serialize user for session
 */
const serializeUser = () => {
    passport_1.default.serializeUser((user, done) => {
        try {
            done(null, user.googleId || user.id);
        }
        catch (error) {
            logger_1.logger.error('User serialization error:', error);
            done(error);
        }
    });
};
exports.serializeUser = serializeUser;
/**
 * Deserialize user from session
 */
const deserializeUser = () => {
    passport_1.default.deserializeUser((id, done) => {
        try {
            // In real implementation, fetch user from database
            const user = { id, googleId: id };
            done(null, user);
        }
        catch (error) {
            logger_1.logger.error('User deserialization error:', error);
            done(error);
        }
    });
};
exports.deserializeUser = deserializeUser;
/**
 * Initialize Passport
 */
const initializePassport = () => {
    try {
        (0, exports.configureGooglePassport)();
        (0, exports.serializeUser)();
        (0, exports.deserializeUser)();
        logger_1.logger.info('✅ Passport initialized');
    }
    catch (error) {
        logger_1.logger.error('Failed to initialize Passport:', error);
        throw error;
    }
};
exports.initializePassport = initializePassport;
/**
 * Google authentication middleware
 */
exports.authenticateGoogle = passport_1.default.authenticate('google', {
    scope: google_oauth_config_1.googleOAuthConfig.scope || ['profile', 'email']
});
/**
 * Google callback middleware
 */
exports.googleCallback = passport_1.default.authenticate('google', {
    failureRedirect: '/login?error=oauth_failed'
});
/**
 * Check if user is authenticated
 */
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        error: 'Not authenticated'
    });
};
exports.isAuthenticated = isAuthenticated;
/**
 * Check if user is authenticated with specific OAuth provider
 */
const isAuthenticatedWithProvider = (provider) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user?.provider === provider) {
            return next();
        }
        res.status(401).json({
            success: false,
            error: `Not authenticated with ${provider}`
        });
    };
};
exports.isAuthenticatedWithProvider = isAuthenticatedWithProvider;
//# sourceMappingURL=google-passport.js.map