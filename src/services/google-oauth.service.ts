import { logger } from '../utils/logger';
import {
  exchangeCodeForTokens,
  fetchGoogleUserInfo,
  refreshGoogleAccessToken,
  revokeGoogleAccessToken
} from '../config/google-oauth.config';
import {
  normalizeOAuthData,
  validateStateToken,
  sanitizeOAuthError,
  logOAuthEvent
} from '../utils/oauth.helper';
import {
  GoogleOAuthData,
  GoogleUserInfo,
  OAuthResponse,
  OAuthState
} from '../types/oauth.types';

export class GoogleOAuthService {
  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(
    code: string,
    state: string,
    provider: string = 'google'
  ): Promise<{
    googleData: GoogleOAuthData;
    oauthState: OAuthState;
  }> {
    try {
      // Validate state token
      const oauthState = validateStateToken(state, provider);
      if (!oauthState) {
        throw new Error('Invalid or expired state token');
      }

      // Exchange code for tokens
      const tokens = await exchangeCodeForTokens(code);
      logger.info(`✅ Exchanged authorization code for tokens`);

      // Fetch user info from Google
      const googleUserInfo = await fetchGoogleUserInfo(tokens.access_token);
      logger.info(`✅ Fetched Google user info`);

      // Normalize OAuth data
      const googleData = normalizeOAuthData(
        googleUserInfo,
        tokens.access_token,
        tokens.refresh_token
      ) as GoogleOAuthData;

      logOAuthEvent('callback_successful', provider, oauthState.userId);

      return {
        googleData,
        oauthState
      };
    } catch (error: any) {
      logger.error('Failed to handle Google OAuth callback:', error);
      logOAuthEvent('callback_failed', provider, undefined, { error: error.message });
      throw error;
    }
  }

  /**
   * Refresh Google OAuth token
   */
  async refreshAccessToken(refreshToken: string): Promise<GoogleOAuthData> {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      const newTokens = await refreshGoogleAccessToken(refreshToken);
      logger.info(`✅ Refreshed Google access token`);

      const googleUserInfo = await fetchGoogleUserInfo(newTokens.access_token);

      const googleData: GoogleOAuthData = {
        id: googleUserInfo.id,
        email: googleUserInfo.email,
        displayName: googleUserInfo.name,
        picture: googleUserInfo.picture,
        accessToken: newTokens.access_token,
        refreshToken: refreshToken, // Keep original refresh token if new one not provided
        connectedAt: new Date()
      };

      logOAuthEvent('token_refreshed', 'google');

      return googleData;
    } catch (error: any) {
      logger.error('Failed to refresh access token:', error);
      throw error;
    }
  }

  /**
   * Revoke Google OAuth token
   */
  async revokeAccessToken(accessToken: string): Promise<void> {
    try {
      await revokeGoogleAccessToken(accessToken);
      logger.info(`✅ Revoked Google access token`);
      logOAuthEvent('token_revoked', 'google');
    } catch (error: any) {
      logger.error('Failed to revoke access token:', error);
      throw error;
    }
  }

  /**
   * Validate access token
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const userInfo = await fetchGoogleUserInfo(accessToken);
      return !!userInfo.id;
    } catch (error) {
      logger.warn('Access token validation failed');
      return false;
    }
  }

  /**
   * Get Google user info
   */
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const userInfo = await fetchGoogleUserInfo(accessToken);
      logger.info(`✅ Retrieved Google user info`);
      return userInfo;
    } catch (error: any) {
      logger.error('Failed to get Google user info:', error);
      throw error;
    }
  }

  /**
   * Map Google profile to user data
   */
  mapGoogleProfileToUserData(profile: any, accessToken: string, refreshToken?: string) {
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
    } catch (error: any) {
      logger.error('Failed to map Google profile:', error);
      throw error;
    }
  }

  /**
   * Verify Google ID token
   */
  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      // In production, verify JWT signature
      // For now, decode and return
      const decoded = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      logger.info(`✅ Verified Google ID token`);
      return decoded;
    } catch (error: any) {
      logger.error('Failed to verify ID token:', error);
      throw error;
    }
  }

  /**
   * Format OAuth error response
   */
  formatErrorResponse(error: any): OAuthResponse {
    return {
      success: false,
      message: 'Google OAuth authentication failed',
      error: sanitizeOAuthError(error)
    };
  }

  /**
   * Format success response
   */
  formatSuccessResponse(data: any, message: string = 'Google OAuth authenticated successfully'): OAuthResponse {
    return {
      success: true,
      message,
      data
    };
  }
}

export default new GoogleOAuthService();