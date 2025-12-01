import { Router, Request, Response, NextFunction } from 'express';
import oauthController from '../controllers/oauth.controller';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Public Routes - No authentication required
 */

/**
 * GET /api/oauth/google
 * Initiate Google OAuth login
 */
router.get(
  '/google',
  oauthController.googleLogin.bind(oauthController)
);

/**
 * GET /api/oauth/google/callback
 * Google OAuth callback handler
 */
router.get(
  '/google/callback',
  oauthController.googleCallback.bind(oauthController)
);

/**
 * GET /api/oauth/providers
 * Get available OAuth providers
 */
router.get(
  '/providers',
  oauthController.getOAuthProviders.bind(oauthController)
);

/**
 * Authenticated Routes - Requires JWT token
 */

/**
 * POST /api/oauth/link/google
 * Link Google account to authenticated user
 */
router.post(
  '/link/google',
  authenticate,
  oauthController.linkGoogleAccount.bind(oauthController)
);

/**
 * GET /api/oauth/accounts
 * Get all linked OAuth accounts for authenticated user
 */
router.get(
  '/accounts',
  authenticate,
  oauthController.getLinkedAccounts.bind(oauthController)
);

/**
 * DELETE /api/oauth/unlink/:provider
 * Unlink OAuth account from authenticated user
 */
router.delete(
  '/unlink/:provider',
  authenticate,
  oauthController.unlinkOAuthAccount.bind(oauthController)
);

/**
 * POST /api/oauth/refresh
 * Refresh OAuth token
 */
router.post(
  '/refresh',
  authenticate,
  oauthController.refreshOAuthToken.bind(oauthController)
);

/**
 * POST /api/oauth/disconnect
 * Disconnect all OAuth accounts
 */
router.post(
  '/disconnect',
  authenticate,
  oauthController.disconnectAllOAuth.bind(oauthController)
);

/**
 * Route logging
 */
router.use((_req: Request, _res: Response, next: NextFunction) => {
  logger.info(`OAuth Route: ${_req.method} ${_req.path}`);
  next();
});

export default router;