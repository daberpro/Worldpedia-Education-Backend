import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import googleOAuthService from '../services/google-oauth.service';
import oauthService from '../services/oauth.service';
import { buildGoogleAuthUrl } from '../config/google-oauth.config';
import {
  generateStateToken,
  sanitizeOAuthError
} from '../utils/oauth.helper';
import { OAuthProvider } from '../types/oauth.types';

export class OAuthController {
  /**
   * Initiate Google OAuth login
   */
  async googleLogin(_req: Request, res: Response): Promise<void> {
    try {
      const state = generateStateToken('google');
      const authUrl = buildGoogleAuthUrl(state);

      logger.info('✅ Google OAuth login initiated');

      res.json({
        success: true,
        message: 'Google OAuth authentication initiated',
        data: {
          authUrl,
          state
        }
      });
    } catch (error: any) {
      logger.error('Failed to initiate Google login:', error);
      res.status(500).json(googleOAuthService.formatErrorResponse(error));
    }
  }

  /**
   * Google OAuth callback handler
   */
  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;

      if (!code || !state) {
        throw new Error('Missing authorization code or state');
      }

      // Handle Google OAuth callback
      const { googleData, oauthState } = await googleOAuthService.handleGoogleCallback(
        code as string,
        state as string,
        'google'
      );

      // Check if user already exists by email or OAuth ID
      const existingUserId = await oauthService.findUserByOAuthAccount('google', googleData.id);

      if (existingUserId && !oauthState.linkingMode) {
        // User already has this Google account linked
        logger.info('✅ Google OAuth callback successful - existing user');

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
      } else if (oauthState.linkingMode && oauthState.userId) {
        // Linking mode - attach to existing user account
        await oauthService.linkOAuthAccount(oauthState.userId, 'google', googleData);

        logger.info('✅ Google OAuth linked to user account');

        res.json({
          success: true,
          message: 'Google account linked successfully',
          data: {
            userId: oauthState.userId,
            linkedAccounts: await oauthService.getLinkedAccounts(oauthState.userId),
            redirectUrl: '/settings/accounts'
          }
        });
      } else {
        // New user registration via Google
        logger.info('✅ Google OAuth callback successful - new user');

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
    } catch (error: any) {
      logger.error('Google OAuth callback error:', error);
      res.status(400).json(googleOAuthService.formatErrorResponse(error));
    }
  }

  /**
   * Link Google account to authenticated user
   */
  async linkGoogleAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      // Check if already linked
      const isLinked = await oauthService.isOAuthAccountLinked(userId, 'google');
      if (isLinked) {
        res.status(400).json({
          success: false,
          error: 'Google account is already linked'
        });
        return;
      }

      // Generate state token for linking mode
      const state = generateStateToken('google', userId, true);
      const authUrl = buildGoogleAuthUrl(state);

      logger.info('✅ Google linking initiated');

      res.json({
        success: true,
        message: 'Google linking initiated',
        data: {
          authUrl,
          state
        }
      });
    } catch (error: any) {
      logger.error('Failed to initiate Google linking:', error);
      res.status(500).json({
        success: false,
        error: sanitizeOAuthError(error)
      });
    }
  }

  /**
   * Get linked OAuth accounts
   */
  async getLinkedAccounts(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      const response = await oauthService.getLinkedAccountsWithStatus(userId);

      logger.info('✅ Retrieved linked accounts');
      res.json(response);
    } catch (error: any) {
      logger.error('Failed to get linked accounts:', error);
      res.status(500).json({
        success: false,
        error: sanitizeOAuthError(error)
      });
    }
  }

  /**
   * Unlink OAuth account
   */
  async unlinkOAuthAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.userId;
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
      const linkedAccounts = await oauthService.getLinkedAccounts(userId);
      if (linkedAccounts.length <= 1) {
        res.status(400).json({
          success: false,
          error: 'Cannot unlink the only linked account'
        });
        return;
      }

      const response = await oauthService.unlinkOAuthAccount(userId, provider);

      logger.info(`✅ Unlinked OAuth account: ${provider}`);

      res.json(response);
    } catch (error: any) {
      logger.error('Failed to unlink OAuth account:', error);
      res.status(500).json({
        success: false,
        error: sanitizeOAuthError(error)
      });
    }
  }

  /**
   * Refresh OAuth token
   */
  async refreshOAuthToken(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.userId;
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

      const account = await oauthService.getOAuthAccount(userId, provider);
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

      const newTokenData = await googleOAuthService.refreshAccessToken(account.refreshToken);

      // Update stored tokens
      await oauthService.updateOAuthAccountData(userId, provider, {
        accessToken: newTokenData.accessToken,
        refreshToken: newTokenData.refreshToken
      });

      logger.info(`✅ Refreshed ${provider} token for user`);

      res.json({
        success: true,
        message: `${provider} token refreshed successfully`,
        data: {
          provider,
          accessToken: newTokenData.accessToken
        }
      });
    } catch (error: any) {
      logger.error('Failed to refresh OAuth token:', error);
      res.status(500).json({
        success: false,
        error: sanitizeOAuthError(error)
      });
    }
  }

  /**
   * Get available OAuth providers
   */
  async getOAuthProviders(_req: Request, res: Response): Promise<void> {
    try {
      const providers = [
        {
          name: 'Google',
          id: OAuthProvider.GOOGLE,
          icon: 'google',
          enabled: true
        }
      ];

      logger.info('✅ Retrieved OAuth providers');
      res.json({
        success: true,
        providers
      });
    } catch (error: any) {
      logger.error('Failed to get OAuth providers:', error);
      res.status(500).json({
        success: false,
        error: sanitizeOAuthError(error)
      });
    }
  }

  /**
   * Disconnect all OAuth accounts
   */
  async disconnectAllOAuth(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      await oauthService.disconnectAllOAuthAccounts(userId);

      logger.info('✅ Disconnected all OAuth accounts');

      res.json({
        success: true,
        message: 'All OAuth accounts disconnected successfully'
      });
    } catch (error: any) {
      logger.error('Failed to disconnect OAuth accounts:', error);
      res.status(500).json({
        success: false,
        error: sanitizeOAuthError(error)
      });
    }
  }
}

export default new OAuthController();