/**
 * Google OAuth Profile Interface
 */
export interface GoogleOAuthProfile {
    id: string;
    displayName: string;
    name?: {
        familyName?: string;
        givenName?: string;
    };
    emails?: Array<{
        value: string;
        verified?: boolean;
    }>;
    photos?: Array<{
        value: string;
    }>;
    provider: string;
    _raw?: string;
    _json?: {
        sub: string;
        name: string;
        given_name: string;
        family_name: string;
        picture: string;
        email: string;
        email_verified: boolean;
        locale: string;
    };
}
/**
 * OAuth Token Interface
 */
export interface OAuthToken {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    tokenType?: string;
}
/**
 * Google OAuth Data Interface
 */
export interface GoogleOAuthData {
    id: string;
    email: string;
    displayName: string;
    picture?: string;
    accessToken: string;
    refreshToken?: string;
    connectedAt: Date;
}
/**
 * OAuth Account Interface - FIXED: Added accessToken and refreshToken
 */
export interface OAuthAccount {
    provider: string;
    id: string;
    email: string;
    displayName: string;
    picture?: string;
    accessToken?: string;
    refreshToken?: string;
    connectedAt: Date;
}
/**
 * OAuth User Interface
 */
export interface OAuthUser {
    userId: string;
    email: string;
    displayName: string;
    picture?: string;
    oauthProvider?: string;
    linkedAccounts: string[];
    lastOAuthLogin?: Date;
    oauth?: {
        google?: GoogleOAuthData;
    };
}
/**
 * OAuth State Token Interface
 */
export interface OAuthState {
    state: string;
    timestamp: number;
    provider: string;
    userId?: string;
    linkingMode?: boolean;
}
/**
 * OAuth Callback Request Interface
 */
export interface OAuthCallbackRequest {
    code: string;
    state: string;
    scope?: string;
}
/**
 * OAuth Linking Request Interface
 */
export interface OAuthLinkingRequest {
    provider: string;
    redirectUrl?: string;
}
/**
 * OAuth Unlinking Request Interface
 */
export interface OAuthUnlinkingRequest {
    provider: string;
}
/**
 * OAuth Response Interface
 */
export interface OAuthResponse {
    success: boolean;
    message: string;
    data?: {
        user?: OAuthUser;
        token?: string;
        redirectUrl?: string;
        authUrl?: string;
    };
    error?: string;
}
/**
 * Account Linking Response Interface
 */
export interface AccountLinkingResponse {
    success: boolean;
    message: string;
    linkedAccounts: OAuthAccount[];
    error?: string;
}
/**
 * Account List Response Interface
 */
export interface AccountListResponse {
    success: boolean;
    accounts: OAuthAccount[];
    primaryProvider?: string;
    canUnlink: boolean[];
}
/**
 * OAuth Provider Configuration
 */
export interface OAuthProviderConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    passReqToCallback?: boolean;
    accessType?: string;
    prompt?: string;
}
/**
 * OAuth Credentials Interface
 */
export interface OAuthCredentials {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    scopes: string[];
}
/**
 * Google User Info Interface
 */
export interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}
/**
 * OAuth Status Enum
 */
export declare enum OAuthStatus {
    PENDING = "pending",
    ACTIVE = "active",
    EXPIRED = "expired",
    REVOKED = "revoked",
    LINKED = "linked",
    UNLINKED = "unlinked"
}
/**
 * OAuth Provider Enum
 */
export declare enum OAuthProvider {
    GOOGLE = "google",
    GITHUB = "github",
    FACEBOOK = "facebook"
}
//# sourceMappingURL=oauth.types.d.ts.map