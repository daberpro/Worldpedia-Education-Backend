import config from './env';
import { logger } from '../utils/logger';
import { OAuthProviderConfig } from '../types/oauth.types';

/**
 * Google OAuth Configuration
 */
export const googleOAuthConfig: OAuthProviderConfig = {
  clientID: config.google.clientId || '',
  clientSecret: config.google.clientSecret || '',
  callbackURL: config.google.callbackUrl || 'http://localhost:3000/api/oauth/google/callback',
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
export const verifyGoogleOAuthConfig = (): void => {
  try {
    if (!googleOAuthConfig.clientID) {
      throw new Error('GOOGLE_CLIENT_ID is not configured');
    }
    if (!googleOAuthConfig.clientSecret) {
      throw new Error('GOOGLE_CLIENT_SECRET is not configured');
    }
    if (!googleOAuthConfig.callbackURL) {
      throw new Error('GOOGLE_CALLBACK_URL is not configured');
    }

    logger.info('✅ Google OAuth configuration verified');
    logger.info(`   Client ID: ${googleOAuthConfig.clientID.substring(0, 10)}...`);
    logger.info(`   Callback URL: ${googleOAuthConfig.callbackURL}`);
  } catch (error: any) {
    logger.error('❌ Google OAuth configuration error:', error.message);
    throw error;
  }
};

/**
 * Get Google OAuth Scopes
 */
export const getGoogleScopes = (): string[] => {
  return googleOAuthConfig.scope || ['profile', 'email', 'openid'];
};

/**
 * Build Google Auth URL
 */
export const buildGoogleAuthUrl = (state: string): string => {
  const params = new URLSearchParams({
    client_id: googleOAuthConfig.clientID,
    redirect_uri: googleOAuthConfig.callbackURL,
    response_type: 'code',
    scope: (googleOAuthConfig.scope || []).join(' '),
    state: state,
    access_type: googleOAuthConfig.accessType || 'offline',
    prompt: googleOAuthConfig.prompt || 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Exchange authorization code for tokens
 */
export const exchangeCodeForTokens = async (
  code: string
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
}> => {
  try {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    
    const params = new URLSearchParams({
      code,
      client_id: googleOAuthConfig.clientID,
      client_secret: googleOAuthConfig.clientSecret,
      redirect_uri: googleOAuthConfig.callbackURL,
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
      const errorData = await response.json() as any;
      throw new Error(`Token exchange failed: ${errorData?.error_description || errorData?.error || 'Unknown error'}`);
    }

    const data = await response.json() as any;
    return data;
  } catch (error: any) {
    logger.error('Failed to exchange code for tokens:', error);
    throw error;
  }
};

/**
 * Fetch Google User Info
 */
export const fetchGoogleUserInfo = async (accessToken: string): Promise<any> => {
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
  } catch (error: any) {
    logger.error('Failed to fetch Google user info:', error);
    throw error;
  }
};

/**
 * Refresh Google Access Token
 */
export const refreshGoogleAccessToken = async (
  refreshToken: string
): Promise<{
  access_token: string;
  expires_in: number;
  token_type: string;
}> => {
  try {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: googleOAuthConfig.clientID,
      client_secret: googleOAuthConfig.clientSecret,
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
      const errorData = await response.json() as any;
      throw new Error(`Token refresh failed: ${errorData?.error_description || errorData?.error || 'Unknown error'}`);
    }

    const data = await response.json() as any;
    return data;
  } catch (error: any) {
    logger.error('Failed to refresh access token:', error);
    throw error;
  }
};

/**
 * Revoke Google Access Token
 */
export const revokeGoogleAccessToken = async (accessToken: string): Promise<void> => {
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

    logger.info('✅ Google access token revoked');
  } catch (error: any) {
    logger.error('Failed to revoke access token:', error);
    throw error;
  }
};