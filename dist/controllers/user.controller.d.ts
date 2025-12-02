import { Request, Response, NextFunction } from 'express';
/**
 * User Controller - Handles user management endpoints
 */
export declare class UserController {
    /**
     * Get user profile
     * GET /api/users/profile
     */
    static getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update user profile
     * PUT /api/users/profile
     */
    static updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user by username
     * GET /api/users/:username
     */
    static getUserByUsername(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all users (admin only)
     * GET /api/users
     */
    static getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update user role (admin only)
     * PATCH /api/users/:id/role
     */
    static updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete user account
     * DELETE /api/users/:id
     */
    static deleteUserAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Lock user account
     * PATCH /api/users/:id/lock
     */
    static lockUserAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Unlock user account
     * PATCH /api/users/:id/unlock
     */
    static unlockUserAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user statistics
     * GET /api/users/:id/stats
     */
    static getUserStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Search users
     * GET /api/users/search
     */
    static searchUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user activity log
     * GET /api/users/:id/activity
     */
    static getUserActivityLog(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Bulk update users (admin only)
     * PATCH /api/users/bulk
     */
    static bulkUpdateUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get my profile (current user)
     * GET /api/users/me
     */
    static getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default UserController;
//# sourceMappingURL=user.controller.d.ts.map