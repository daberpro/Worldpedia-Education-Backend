import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { validateStateToken } from '../utils/oauth.helper';
import googleOAuthService from '../services/google-oauth.service';
import oauthService from '../services/oauth.service';

/**
 * Verify OAuth state token
 */
export const verifyOAuthState = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { state, provider } = req.query;

    if (!state || !provider) {
      logger.warn('Missing OAuth state or provider');
      res.status(400).json({
        success: false,
        error: 'Missing OAuth state or provider'
      });
      return;
    }

    const validatedState = validateStateToken(state as string, provider as string);
    if (!validatedState) {
      logger.warn('Invalid or expired OAuth state token');
      res.status(400).json({
        success: false,
        error: 'Invalid or expired OAuth state'
      });
      return;
    }

    // Attach state to request
    (req as any).oauthState = validatedState;
    next();
  } catch (error: any) {
    logger.error('OAuth state verification error:', error);
    res.status(500).json({
      success: false,
      error: 'OAuth state verification failed'
    });
  }
};

/**
 * Ensure OAuth account exists
 */
export const ensureOAuthAccountExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { provider } = req.params;
    const userId = (req.user as any)?.userId;

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

    const oauthAccount = await oauthService.getOAuthAccount(userId, provider);
    if (!oauthAccount) {
      res.status(404).json({
        success: false,
        error: `${provider} account not found`
      });
      return;
    }

    // Attach account to request
    (req as any).oauthAccount = oauthAccount;
    next();
  } catch (error: any) {
    logger.error('OAuth account check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify OAuth account'
    });
  }
};

/**
 * Validate OAuth access token
 */
export const validateOAuthAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { provider } = req.params;
    const userId = (req.user as any)?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const oauthAccount = await oauthService.getOAuthAccount(userId, provider);
    if (!oauthAccount) {
      res.status(404).json({
        success: false,
        error: `${provider} account not found`
      });
      return;
    }

    // Validate access token (for Google)
    if (provider === 'google' && oauthAccount.accessToken) {
      const isValid = await googleOAuthService.validateAccessToken(oauthAccount.accessToken);
      if (!isValid) {
        logger.warn(`Invalid ${provider} access token for user`);
        res.status(401).json({
          success: false,
          error: `${provider} access token is invalid or expired`
        });
        return;
      }
    }

    // Attach account to request
    (req as any).oauthAccount = oauthAccount;
    next();
  } catch (error: any) {
    logger.error('OAuth access token validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate OAuth access token'
    });
  }
};

/**
 * Check if user has OAuth account
 */
export const requireOAuthAccount = (provider: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any)?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      const hasAccount = await oauthService.isOAuthAccountLinked(userId, provider);
      if (!hasAccount) {
        res.status(403).json({
          success: false,
          error: `${provider} account is not linked`
        });
        return;
      }

      next();
    } catch (error: any) {
      logger.error('OAuth requirement check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check OAuth account requirement'
      });
    }
  };
};

/**
 * Refresh OAuth token if needed
 */
export const refreshOAuthTokenIfNeeded = (provider: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any)?.userId;

      if (!userId) {
        return next();
      }

      const oauthAccount = await oauthService.getOAuthAccount(userId, provider);
      if (!oauthAccount) {
        return next();
      }

      // Check if token refresh is needed (for Google)
      if (provider === 'google' && oauthAccount.refreshToken) {
        // In a real scenario, check token expiry and refresh if needed
        // For now, just log
        logger.debug(`OAuth token refresh check for ${provider}`);
      }

      // Attach account to request
      (req as any).oauthAccount = oauthAccount;
      next();
    } catch (error: any) {
      logger.error('OAuth token refresh error:', error);
      // Don't fail request, just continue
      next();
    }
  };
};

/**
 * Log OAuth activity
 */
export const logOAuthActivity = (_req: Request, _res: Response, next: NextFunction): void => {
  const userId = (_req.user as any)?.userId || 'anonymous';
  const provider = _req.params.provider || 'unknown';
  
  logger.info(`OAuth Activity: ${_req.method} ${_req.path}`, {
    userId,
    provider,
    timestamp: new Date().toISOString()
  });

  next();
};

/**
 * Handle OAuth errors gracefully
 */
export const handleOAuthErrors = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('OAuth error:', error);

  if (error.code === 'access_denied') {
    res.status(403).json({
      success: false,
      error: 'OAuth access was denied'
    });
  } else if (error.code === 'invalid_grant') {
    res.status(400).json({
      success: false,
      error: 'OAuth grant is invalid or expired'
    });
  } else if (error.code === 'invalid_client') {
    res.status(400).json({
      success: false,
      error: 'OAuth client configuration is invalid'
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'OAuth authentication failed'
    });
  }
};