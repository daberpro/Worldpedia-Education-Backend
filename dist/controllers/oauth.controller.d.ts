import { Request, Response } from 'express';
export declare class OAuthController {
    /**
     * Initiate Google OAuth login
     */
    googleLogin(_req: Request, res: Response): Promise<void>;
    /**
     * Google OAuth callback handler
     */
    googleCallback(req: Request, res: Response): Promise<void>;
    /**
     * Link Google account to authenticated user
     */
    linkGoogleAccount(req: Request, res: Response): Promise<void>;
    /**
     * Get linked OAuth accounts
     */
    getLinkedAccounts(req: Request, res: Response): Promise<void>;
    /**
     * Unlink OAuth account
     */
    unlinkOAuthAccount(req: Request, res: Response): Promise<void>;
    /**
     * Refresh OAuth token
     */
    refreshOAuthToken(req: Request, res: Response): Promise<void>;
    /**
     * Get available OAuth providers
     */
    getOAuthProviders(_req: Request, res: Response): Promise<void>;
    /**
     * Disconnect all OAuth accounts
     */
    disconnectAllOAuth(req: Request, res: Response): Promise<void>;
}
declare const _default: OAuthController;
export default _default;
//# sourceMappingURL=oauth.controller.d.ts.map