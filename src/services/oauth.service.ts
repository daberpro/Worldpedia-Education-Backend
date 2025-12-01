import { logger } from '../utils/logger';
import { logOAuthEvent } from '../utils/oauth.helper';
import {
  OAuthAccount,
  AccountLinkingResponse,
  AccountListResponse
} from '../types/oauth.types';

/**
 * In-memory OAuth account storage
 * TODO: Replace with MongoDB in Phase 4
 */
const oauthAccountStorage = new Map<string, any>();

export class OAuthService {
  /**
   * Link OAuth account to user
   */
  async linkOAuthAccount(
    userId: string,
    provider: string,
    oauthData: any
  ): Promise<AccountLinkingResponse> {
    try {
      // Check if OAuth account is already linked to another user
      const existingLink = await this.findOAuthLink(provider, oauthData.id);
      if (existingLink && existingLink.userId !== userId) {
        throw new Error(`This ${provider} account is already linked to another user`);
      }

      // Create OAuth account record
      const accountKey = `${userId}-${provider}-${oauthData.id}`;
      const accountRecord = {
        userId,
        provider,
        id: oauthData.id,
        email: oauthData.email,
        displayName: oauthData.displayName,
        picture: oauthData.picture,
        connectedAt: oauthData.connectedAt || new Date(),
        accessToken: oauthData.accessToken,
        refreshToken: oauthData.refreshToken
      };

      oauthAccountStorage.set(accountKey, accountRecord);

      logger.info(`✅ OAuth account linked: ${provider}`, { userId });
      logOAuthEvent('account_linked', provider, userId);

      // Get all linked accounts
      const linkedAccounts = await this.getLinkedAccounts(userId);

      return {
        success: true,
        message: `${provider} account linked successfully`,
        linkedAccounts
      };
    } catch (error: any) {
      logger.error('Failed to link OAuth account:', error);
      throw error;
    }
  }

  /**
   * Unlink OAuth account from user
   */
  async unlinkOAuthAccount(userId: string, provider: string): Promise<AccountLinkingResponse> {
    try {
      // Find and delete the OAuth account
      let removed = false;
      for (const [key, value] of oauthAccountStorage.entries()) {
        if (value.userId === userId && value.provider === provider) {
          oauthAccountStorage.delete(key);
          removed = true;
          break;
        }
      }

      if (!removed) {
        throw new Error(`${provider} account is not linked to this user`);
      }

      logger.info(`✅ OAuth account unlinked: ${provider}`, { userId });
      logOAuthEvent('account_unlinked', provider, userId);

      // Get remaining linked accounts
      const linkedAccounts = await this.getLinkedAccounts(userId);

      return {
        success: true,
        message: `${provider} account unlinked successfully`,
        linkedAccounts
      };
    } catch (error: any) {
      logger.error('Failed to unlink OAuth account:', error);
      throw error;
    }
  }

  /**
   * Get all linked OAuth accounts for user
   */
  async getLinkedAccounts(userId: string): Promise<OAuthAccount[]> {
    try {
      const accounts: OAuthAccount[] = [];

      for (const value of oauthAccountStorage.values()) {
        if (value.userId === userId) {
          accounts.push({
            provider: value.provider,
            id: value.id,
            email: value.email,
            displayName: value.displayName,
            picture: value.picture,
            connectedAt: value.connectedAt
          });
        }
      }

      logger.info(`✅ Retrieved ${accounts.length} linked accounts for user`);
      return accounts;
    } catch (error: any) {
      logger.error('Failed to get linked accounts:', error);
      throw error;
    }
  }

  /**
   * Get linked accounts with unlock information
   */
  async getLinkedAccountsWithStatus(userId: string): Promise<AccountListResponse> {
    try {
      const accounts = await this.getLinkedAccounts(userId);
      
      // Cannot unlink if only one account is linked
      const canUnlink = accounts.map(() => accounts.length > 1);

      const primaryProvider = accounts.length > 0 ? accounts[0].provider : undefined;

      return {
        success: true,
        accounts,
        primaryProvider,
        canUnlink
      };
    } catch (error: any) {
      logger.error('Failed to get linked accounts status:', error);
      throw error;
    }
  }

  /**
   * Check if OAuth account is linked to user
   */
  async isOAuthAccountLinked(userId: string, provider: string): Promise<boolean> {
    try {
      for (const value of oauthAccountStorage.values()) {
        if (value.userId === userId && value.provider === provider) {
          return true;
        }
      }
      return false;
    } catch (error: any) {
      logger.error('Failed to check OAuth account link:', error);
      return false;
    }
  }

  /**
   * Find OAuth link by provider and ID
   */
  async findOAuthLink(provider: string, providerId: string): Promise<any | null> {
    try {
      for (const value of oauthAccountStorage.values()) {
        if (value.provider === provider && value.id === providerId) {
          return value;
        }
      }
      return null;
    } catch (error: any) {
      logger.error('Failed to find OAuth link:', error);
      return null;
    }
  }

  /**
   * Find user by OAuth account
   */
  async findUserByOAuthAccount(provider: string, providerId: string): Promise<string | null> {
    try {
      const link = await this.findOAuthLink(provider, providerId);
      return link ? link.userId : null;
    } catch (error: any) {
      logger.error('Failed to find user by OAuth account:', error);
      return null;
    }
  }

  /**
   * Update OAuth account data
   */
  async updateOAuthAccountData(
    userId: string,
    provider: string,
    updates: Partial<any>
  ): Promise<void> {
    try {
      for (const [key, value] of oauthAccountStorage.entries()) {
        if (value.userId === userId && value.provider === provider) {
          oauthAccountStorage.set(key, {
            ...value,
            ...updates,
            updatedAt: new Date()
          });
          logger.info(`✅ Updated OAuth account data: ${provider}`, { userId });
          return;
        }
      }
      throw new Error(`${provider} account not found for user`);
    } catch (error: any) {
      logger.error('Failed to update OAuth account:', error);
      throw error;
    }
  }

  /**
   * Disconnect all OAuth accounts
   */
  async disconnectAllOAuthAccounts(userId: string): Promise<void> {
    try {
      const keysToDelete: string[] = [];

      for (const [key, value] of oauthAccountStorage.entries()) {
        if (value.userId === userId) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => oauthAccountStorage.delete(key));

      logger.info(`✅ Disconnected ${keysToDelete.length} OAuth accounts for user`);
      logOAuthEvent('all_accounts_disconnected', 'oauth', userId);
    } catch (error: any) {
      logger.error('Failed to disconnect OAuth accounts:', error);
      throw error;
    }
  }

  /**
   * Get OAuth account by provider and user
   */
  async getOAuthAccount(userId: string, provider: string): Promise<OAuthAccount | null> {
    try {
      for (const value of oauthAccountStorage.values()) {
        if (value.userId === userId && value.provider === provider) {
          return {
            provider: value.provider,
            id: value.id,
            email: value.email,
            displayName: value.displayName,
            picture: value.picture,
            connectedAt: value.connectedAt
          };
        }
      }
      return null;
    } catch (error: any) {
      logger.error('Failed to get OAuth account:', error);
      return null;
    }
  }

  /**
   * Migrate OAuth account to new user
   */
  async migrateOAuthAccount(
    oldUserId: string,
    newUserId: string,
    provider: string
  ): Promise<void> {
    try {
      for (const [key, value] of oauthAccountStorage.entries()) {
        if (value.userId === oldUserId && value.provider === provider) {
          oauthAccountStorage.set(key, {
            ...value,
            userId: newUserId
          });
          logger.info(`✅ Migrated OAuth account: ${provider}`, { oldUserId, newUserId });
          return;
        }
      }
      throw new Error(`${provider} account not found`);
    } catch (error: any) {
      logger.error('Failed to migrate OAuth account:', error);
      throw error;
    }
  }

  /**
   * Get all OAuth statistics
   */
  async getOAuthStatistics(): Promise<{
    totalLinkedAccounts: number;
    accountsByProvider: Record<string, number>;
    usersWithOAuth: number;
  }> {
    try {
      const byProvider: Record<string, number> = {};
      const userIds = new Set<string>();

      for (const value of oauthAccountStorage.values()) {
        byProvider[value.provider] = (byProvider[value.provider] || 0) + 1;
        userIds.add(value.userId);
      }

      return {
        totalLinkedAccounts: oauthAccountStorage.size,
        accountsByProvider: byProvider,
        usersWithOAuth: userIds.size
      };
    } catch (error: any) {
      logger.error('Failed to get OAuth statistics:', error);
      throw error;
    }
  }
}

export default new OAuthService();