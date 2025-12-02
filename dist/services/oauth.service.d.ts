import { OAuthAccount, AccountLinkingResponse, AccountListResponse } from '../types/oauth.types';
export declare class OAuthService {
    /**
     * Link OAuth account to user
     */
    linkOAuthAccount(userId: string, provider: string, oauthData: any): Promise<AccountLinkingResponse>;
    /**
     * Unlink OAuth account from user
     */
    unlinkOAuthAccount(userId: string, provider: string): Promise<AccountLinkingResponse>;
    /**
     * Get all linked OAuth accounts for user
     */
    getLinkedAccounts(userId: string): Promise<OAuthAccount[]>;
    /**
     * Get linked accounts with unlock information
     */
    getLinkedAccountsWithStatus(userId: string): Promise<AccountListResponse>;
    /**
     * Check if OAuth account is linked to user
     */
    isOAuthAccountLinked(userId: string, provider: string): Promise<boolean>;
    /**
     * Find OAuth link by provider and ID
     */
    findOAuthLink(provider: string, providerId: string): Promise<any | null>;
    /**
     * Find user by OAuth account
     */
    findUserByOAuthAccount(provider: string, providerId: string): Promise<string | null>;
    /**
     * Update OAuth account data
     */
    updateOAuthAccountData(userId: string, provider: string, updates: Partial<any>): Promise<void>;
    /**
     * Disconnect all OAuth accounts
     */
    disconnectAllOAuthAccounts(userId: string): Promise<void>;
    /**
     * Get OAuth account by provider and user
     */
    getOAuthAccount(userId: string, provider: string): Promise<OAuthAccount | null>;
    /**
     * Migrate OAuth account to new user
     */
    migrateOAuthAccount(oldUserId: string, newUserId: string, provider: string): Promise<void>;
    /**
     * Get all OAuth statistics
     */
    getOAuthStatistics(): Promise<{
        totalLinkedAccounts: number;
        accountsByProvider: Record<string, number>;
        usersWithOAuth: number;
    }>;
}
declare const _default: OAuthService;
export default _default;
//# sourceMappingURL=oauth.service.d.ts.map