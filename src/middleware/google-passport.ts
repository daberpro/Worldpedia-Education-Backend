import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { logger } from '../utils/logger';
import { googleOAuthConfig } from '../config/google-oauth.config';
import {
  extractEmailFromProfile,
  extractDisplayNameFromProfile,
  extractPictureFromProfile,
  extractProviderId,
  logOAuthEvent
} from '../utils/oauth.helper';

/**
 * Configure Passport Google Strategy
 */
export const configureGooglePassport = (): void => {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleOAuthConfig.clientID,
          clientSecret: googleOAuthConfig.clientSecret,
          callbackURL: googleOAuthConfig.callbackURL,
          passReqToCallback: true
        },
        async (_req: any, accessToken: string, refreshToken: string | undefined, profile: any, done: any) => {
          try {
            const email = extractEmailFromProfile(profile);
            const displayName = extractDisplayNameFromProfile(profile);
            const picture = extractPictureFromProfile(profile);
            const providerId = extractProviderId(profile);

            if (!email || !providerId) {
              return done(new Error('Missing required profile information'));
            }

            // Create user object from Google profile
            const user: any = {
              googleId: providerId,
              email,
              displayName,
              picture,
              provider: 'google',
              profile: profile._json,
              accessToken,
              refreshToken
            };

            logger.info(`✅ Google OAuth verified for ${email}`);
            logOAuthEvent('passport_verified', 'google', undefined, { email });

            return done(null, user);
          } catch (error: any) {
            logger.error('Google Passport strategy error:', error);
            logOAuthEvent('passport_error', 'google', undefined, { error: error.message });
            return done(error);
          }
        }
      )
    );

    logger.info('✅ Google Passport strategy configured');
  } catch (error: any) {
    logger.error('Failed to configure Google Passport strategy:', error);
    throw error;
  }
};

/**
 * Serialize user for session
 */
export const serializeUser = (): void => {
  passport.serializeUser((user: any, done: any) => {
    try {
      done(null, user.googleId || user.id);
    } catch (error: any) {
      logger.error('User serialization error:', error);
      done(error);
    }
  });
};

/**
 * Deserialize user from session
 */
export const deserializeUser = (): void => {
  passport.deserializeUser((id: string, done: any) => {
    try {
      // In real implementation, fetch user from database
      const user = { id, googleId: id };
      done(null, user);
    } catch (error: any) {
      logger.error('User deserialization error:', error);
      done(error);
    }
  });
};

/**
 * Initialize Passport
 */
export const initializePassport = (): void => {
  try {
    configureGooglePassport();
    serializeUser();
    deserializeUser();
    logger.info('✅ Passport initialized');
  } catch (error: any) {
    logger.error('Failed to initialize Passport:', error);
    throw error;
  }
};

/**
 * Google authentication middleware
 */
export const authenticateGoogle = passport.authenticate('google', {
  scope: googleOAuthConfig.scope || ['profile', 'email']
});

/**
 * Google callback middleware
 */
export const googleCallback = passport.authenticate('google', {
  failureRedirect: '/login?error=oauth_failed'
});

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (req: any, res: any, next: any): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    error: 'Not authenticated'
  });
};

/**
 * Check if user is authenticated with specific OAuth provider
 */
export const isAuthenticatedWithProvider = (provider: string) => {
  return (req: any, res: any, next: any): void => {
    if (req.isAuthenticated() && req.user?.provider === provider) {
      return next();
    }
    res.status(401).json({
      success: false,
      error: `Not authenticated with ${provider}`
    });
  };
};