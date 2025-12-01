import crypto from 'crypto';
import { logger } from './logger';
import { OAuthState } from '../types/oauth.types';

/**
 * Generate random state token for CSRF protection
 */
export const generateStateToken = (
  provider: string,
  userId?: string,
  linkingMode: boolean = false
): string => {
  try {
    const state: OAuthState = {
      state: crypto.randomBytes(32).toString('hex'),
      timestamp: Date.now(),
      provider,
      userId,
      linkingMode
    };

    // Encode state as base64 JSON
    const encodedState = Buffer.from(JSON.stringify(state)).toString('base64');
    
    logger.info(`✅ Generated OAuth state token for ${provider}`);
    return encodedState;
  } catch (error: any) {
    logger.error('Failed to generate state token:', error);
    throw error;
  }
};

/**
 * Decode and validate state token
 */
export const validateStateToken = (encodedState: string, provider: string): OAuthState | null => {
  try {
    const decodedState = Buffer.from(encodedState, 'base64').toString('utf-8');
    const state: OAuthState = JSON.parse(decodedState);

    // Validate state structure
    if (!state.state || !state.timestamp || state.provider !== provider) {
      logger.warn('Invalid state token structure');
      return null;
    }

    // Check if state is not older than 10 minutes
    const stateAge = (Date.now() - state.timestamp) / 1000 / 60; // in minutes
    if (stateAge > 10) {
      logger.warn('State token expired');
      return null;
    }

    logger.info(`✅ State token validated for ${provider}`);
    return state;
  } catch (error: any) {
    logger.error('Failed to validate state token:', error);
    return null;
  }
};

/**
 * Extract email from OAuth profile
 */
export const extractEmailFromProfile = (profile: any): string | null => {
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
  } catch (error) {
    logger.error('Failed to extract email from profile:', error);
    return null;
  }
};

/**
 * Extract display name from OAuth profile
 */
export const extractDisplayNameFromProfile = (profile: any): string => {
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
  } catch (error) {
    logger.error('Failed to extract display name:', error);
    return 'User';
  }
};

/**
 * Extract picture from OAuth profile
 */
export const extractPictureFromProfile = (profile: any): string | null => {
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
  } catch (error) {
    logger.error('Failed to extract picture:', error);
    return null;
  }
};

/**
 * Extract provider ID from OAuth profile
 */
export const extractProviderId = (profile: any): string | null => {
  try {
    if (profile.id) {
      return profile.id;
    }

    if (profile._json?.sub) {
      return profile._json.sub;
    }

    return null;
  } catch (error) {
    logger.error('Failed to extract provider ID:', error);
    return null;
  }
};

/**
 * Build redirect URL after OAuth
 */
export const buildRedirectUrl = (
  baseUrl: string,
  params: Record<string, string>
): string => {
  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  } catch (error) {
    logger.error('Failed to build redirect URL:', error);
    return baseUrl;
  }
};

/**
 * Normalize OAuth account data
 */
export const normalizeOAuthData = (profile: any, accessToken: string, refreshToken?: string) => {
  try {
    const email = extractEmailFromProfile(profile);
    const displayName = extractDisplayNameFromProfile(profile);
    const picture = extractPictureFromProfile(profile);
    const providerId = extractProviderId(profile);

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
  } catch (error: any) {
    logger.error('Failed to normalize OAuth data:', error);
    throw error;
  }
};

/**
 * Validate OAuth provider
 */
export const isValidOAuthProvider = (provider: string): boolean => {
  const validProviders = ['google', 'github', 'facebook'];
  return validProviders.includes(provider.toLowerCase());
};

/**
 * Check if email is already used
 */
export const isEmailRegistered = (email: string, existingEmail?: string): boolean => {
  // This will be called in service layer to check database
  // Return true if email exists and is different from current user's email
  return email !== existingEmail;
};

/**
 * Generate OAuth linking URL
 */
export const generateOAuthLinkingUrl = (provider: string, state: string): string => {
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

/**
 * Generate token expiry time
 */
export const calculateTokenExpiry = (expiresIn: number): Date => {
  return new Date(Date.now() + expiresIn * 1000);
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (expiresAt?: Date): boolean => {
  if (!expiresAt) {
    return false;
  }
  return new Date() > expiresAt;
};

/**
 * Sanitize OAuth error messages
 */
export const sanitizeOAuthError = (error: any): string => {
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

/**
 * Log OAuth event
 */
export const logOAuthEvent = (
  event: string,
  provider: string,
  userId?: string,
  details?: Record<string, any>
): void => {
  logger.info(`OAuth Event: ${event}`, {
    provider,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

/**
 * Validate OAuth response
 */
export const validateOAuthResponse = (response: any): boolean => {
  return (
    response &&
    typeof response === 'object' &&
    (response.access_token || response.token) &&
    response.token_type
  );
};