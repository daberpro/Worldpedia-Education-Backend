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
/**
 * User Service - Handles user profile management
 */
export declare class UserService {
    /**
     * Get user profile
     */
    static getUserProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Update user profile
     */
    static updateUserProfile(userId: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, import("../models").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get user by username
     */
    static getUserByUsername(username: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Get all users with pagination
     */
    static getAllUsers(page?: number, limit?: number, filters?: any): Promise<{
        users: (import("mongoose").Document<unknown, {}, import("../models").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    /**
     * Update user role (admin only)
     */
    static updateUserRole(userId: string, newRole: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Delete user account
     */
    static deleteUserAccount(userId: string, requestingUserId: string): Promise<{
        message: string;
    }>;
    /**
     * Lock/Unlock user account
     */
    static lockUnlockAccount(userId: string, lock: boolean): Promise<{
        message: string;
    }>;
    /**
     * Get user statistics
     */
    static getUserStats(userId: string): Promise<{
        userId: import("mongoose").Types.ObjectId;
        fullName: string;
        email: string;
        role: "student" | "admin";
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLogin: Date | undefined;
        lastLogout: Date | undefined;
        isLocked: boolean;
        loginAttempts: number;
    }>;
    /**
     * Search users
     */
    static searchUsers(query: string, page?: number, limit?: number): Promise<{
        users: (import("mongoose").Document<unknown, {}, import("../models").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    /**
     * Get user activity log
     */
    static getUserActivityLog(userId: string): Promise<{
        userId: import("mongoose").Types.ObjectId;
        lastLogin: Date | undefined;
        lastLogout: Date | undefined;
        createdAt: Date;
        updatedAt: Date;
        isLocked: boolean;
        lockUntil: Date | null | undefined;
        loginAttempts: number;
    }>;
    /**
     * Bulk update users (admin only)
     */
    static bulkUpdateUsers(userIds: string[], updateData: any): Promise<{
        modifiedCount: number;
        matchedCount: number;
    }>;
}
export default UserService;
//# sourceMappingURL=user.service.d.ts.map