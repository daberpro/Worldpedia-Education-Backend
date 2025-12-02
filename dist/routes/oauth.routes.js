"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauth_controller_1 = __importDefault(require("../controllers/oauth.controller"));
const auth_1 = require("../middleware/auth");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
/**
 * Public Routes - No authentication required
 */
/**
 * GET /api/oauth/google
 * Initiate Google OAuth login
 */
router.get('/google', oauth_controller_1.default.googleLogin.bind(oauth_controller_1.default));
/**
 * GET /api/oauth/google/callback
 * Google OAuth callback handler
 */
router.get('/google/callback', oauth_controller_1.default.googleCallback.bind(oauth_controller_1.default));
/**
 * GET /api/oauth/providers
 * Get available OAuth providers
 */
router.get('/providers', oauth_controller_1.default.getOAuthProviders.bind(oauth_controller_1.default));
/**
 * Authenticated Routes - Requires JWT token
 */
/**
 * POST /api/oauth/link/google
 * Link Google account to authenticated user
 */
router.post('/link/google', auth_1.authenticate, oauth_controller_1.default.linkGoogleAccount.bind(oauth_controller_1.default));
/**
 * GET /api/oauth/accounts
 * Get all linked OAuth accounts for authenticated user
 */
router.get('/accounts', auth_1.authenticate, oauth_controller_1.default.getLinkedAccounts.bind(oauth_controller_1.default));
/**
 * DELETE /api/oauth/unlink/:provider
 * Unlink OAuth account from authenticated user
 */
router.delete('/unlink/:provider', auth_1.authenticate, oauth_controller_1.default.unlinkOAuthAccount.bind(oauth_controller_1.default));
/**
 * POST /api/oauth/refresh
 * Refresh OAuth token
 */
router.post('/refresh', auth_1.authenticate, oauth_controller_1.default.refreshOAuthToken.bind(oauth_controller_1.default));
/**
 * POST /api/oauth/disconnect
 * Disconnect all OAuth accounts
 */
router.post('/disconnect', auth_1.authenticate, oauth_controller_1.default.disconnectAllOAuth.bind(oauth_controller_1.default));
/**
 * Route logging
 */
router.use((_req, _res, next) => {
    logger_1.logger.info(`OAuth Route: ${_req.method} ${_req.path}`);
    next();
});
exports.default = router;
//# sourceMappingURL=oauth.routes.js.map