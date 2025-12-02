"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthProvider = exports.OAuthStatus = void 0;
/**
 * OAuth Status Enum
 */
var OAuthStatus;
(function (OAuthStatus) {
    OAuthStatus["PENDING"] = "pending";
    OAuthStatus["ACTIVE"] = "active";
    OAuthStatus["EXPIRED"] = "expired";
    OAuthStatus["REVOKED"] = "revoked";
    OAuthStatus["LINKED"] = "linked";
    OAuthStatus["UNLINKED"] = "unlinked";
})(OAuthStatus || (exports.OAuthStatus = OAuthStatus = {}));
/**
 * OAuth Provider Enum
 */
var OAuthProvider;
(function (OAuthProvider) {
    OAuthProvider["GOOGLE"] = "google";
    OAuthProvider["GITHUB"] = "github";
    OAuthProvider["FACEBOOK"] = "facebook";
})(OAuthProvider || (exports.OAuthProvider = OAuthProvider = {}));
//# sourceMappingURL=oauth.types.js.map