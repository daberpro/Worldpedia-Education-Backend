/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
export declare class AuthService {
    static register(fullName: string, username: string, email: string, password: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        fullName: string;
        username: string;
        email: string;
        role: "student" | "admin";
    }>;
    static login(usernameOrEmail: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            fullName: string;
            email: string;
            username: string;
            role: "student" | "admin";
            avatar: string | undefined;
        };
    }>;
    static generateTokens(user: any): {
        accessToken: string;
        refreshToken: string;
    };
    static refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    static logout(userId: string): Promise<{
        message: string;
    }>;
    static verifyEmail(email: string, activationCode: string): Promise<{
        message: string;
    }>;
    static requestPasswordReset(email: string): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string;
    }>;
    static resetPassword(email: string, token: string, newPassword: string): Promise<{
        message: string;
    }>;
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    static resendVerificationCode(email: string): Promise<{
        message: string;
    }>;
}
export default AuthService;
//# sourceMappingURL=auth.service.d.ts.map