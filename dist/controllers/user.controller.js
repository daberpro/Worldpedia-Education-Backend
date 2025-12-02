"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
/**
 * User Controller - Handles user management endpoints
 */
class UserController {
    /**
     * Get user profile
     * GET /api/users/profile
     */
    static async getUserProfile(req, res, next) {
        try {
            const userId = req.user?.userId;
            const user = await services_1.UserService.getUserProfile(userId);
            res.status(200).json((0, utils_1.successResponse)(user));
        }
        catch (error) {
            logger_1.logger.error('Get user profile controller error', error);
            next(error);
        }
    }
    /**
     * Update user profile
     * PUT /api/users/profile
     */
    static async updateUserProfile(req, res, next) {
        try {
            const userId = req.user?.userId;
            const user = await services_1.UserService.updateUserProfile(userId, req.body);
            res.status(200).json((0, utils_1.successResponse)(user, 'Profile updated successfully'));
        }
        catch (error) {
            logger_1.logger.error('Update user profile controller error', error);
            next(error);
        }
    }
    /**
     * Get user by username
     * GET /api/users/:username
     */
    static async getUserByUsername(req, res, next) {
        try {
            const { username } = req.params;
            const user = await services_1.UserService.getUserByUsername(username);
            res.status(200).json((0, utils_1.successResponse)(user));
        }
        catch (error) {
            logger_1.logger.error('Get user by username controller error', error);
            next(error);
        }
    }
    /**
     * Get all users (admin only)
     * GET /api/users
     */
    static async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                role: req.query.role,
                isVerified: req.query.isVerified === 'true' ? true : undefined,
                search: req.query.search
            };
            const result = await services_1.UserService.getAllUsers(page, limit, filters);
            res.status(200).json((0, utils_1.paginatedResponse)(result.users, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get all users controller error', error);
            next(error);
        }
    }
    /**
     * Update user role (admin only)
     * PATCH /api/users/:id/role
     */
    static async updateUserRole(req, res, next) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!role) {
                res.status(400).json({
                    success: false,
                    error: 'Role is required'
                });
                return;
            }
            const user = await services_1.UserService.updateUserRole(id, role);
            res.status(200).json((0, utils_1.successResponse)(user, 'User role updated successfully'));
        }
        catch (error) {
            logger_1.logger.error('Update user role controller error', error);
            next(error);
        }
    }
    /**
     * Delete user account
     * DELETE /api/users/:id
     */
    static async deleteUserAccount(req, res, next) {
        try {
            const { id } = req.params;
            const requestingUserId = req.user?.userId;
            const result = await services_1.UserService.deleteUserAccount(id, requestingUserId);
            res.status(200).json((0, utils_1.deletedResponse)(result.message));
        }
        catch (error) {
            logger_1.logger.error('Delete user account controller error', error);
            next(error);
        }
    }
    /**
     * Lock user account
     * PATCH /api/users/:id/lock
     */
    static async lockUserAccount(req, res, next) {
        try {
            const { id } = req.params;
            const result = await services_1.UserService.lockUnlockAccount(id, true);
            res.status(200).json((0, utils_1.successResponse)(result));
        }
        catch (error) {
            logger_1.logger.error('Lock user account controller error', error);
            next(error);
        }
    }
    /**
     * Unlock user account
     * PATCH /api/users/:id/unlock
     */
    static async unlockUserAccount(req, res, next) {
        try {
            const { id } = req.params;
            const result = await services_1.UserService.lockUnlockAccount(id, false);
            res.status(200).json((0, utils_1.successResponse)(result));
        }
        catch (error) {
            logger_1.logger.error('Unlock user account controller error', error);
            next(error);
        }
    }
    /**
     * Get user statistics
     * GET /api/users/:id/stats
     */
    static async getUserStats(req, res, next) {
        try {
            const { id } = req.params;
            const stats = await services_1.UserService.getUserStats(id);
            res.status(200).json((0, utils_1.successResponse)(stats));
        }
        catch (error) {
            logger_1.logger.error('Get user stats controller error', error);
            next(error);
        }
    }
    /**
     * Search users
     * GET /api/users/search
     */
    static async searchUsers(req, res, next) {
        try {
            const query = req.query.q;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                res.status(400).json({
                    success: false,
                    error: 'Search query is required'
                });
                return;
            }
            const result = await services_1.UserService.searchUsers(query, page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.users, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Search users controller error', error);
            next(error);
        }
    }
    /**
     * Get user activity log
     * GET /api/users/:id/activity
     */
    static async getUserActivityLog(req, res, next) {
        try {
            const { id } = req.params;
            const activity = await services_1.UserService.getUserActivityLog(id);
            res.status(200).json((0, utils_1.successResponse)(activity));
        }
        catch (error) {
            logger_1.logger.error('Get user activity log controller error', error);
            next(error);
        }
    }
    /**
     * Bulk update users (admin only)
     * PATCH /api/users/bulk
     */
    static async bulkUpdateUsers(req, res, next) {
        try {
            const { userIds, updateData } = req.body;
            if (!userIds || !Array.isArray(userIds) || !updateData) {
                res.status(400).json({
                    success: false,
                    error: 'User IDs array and update data are required'
                });
                return;
            }
            const result = await services_1.UserService.bulkUpdateUsers(userIds, updateData);
            res.status(200).json((0, utils_1.successResponse)(result, 'Users updated successfully'));
        }
        catch (error) {
            logger_1.logger.error('Bulk update users controller error', error);
            next(error);
        }
    }
    /**
     * Get my profile (current user)
     * GET /api/users/me
     */
    static async getMyProfile(req, res, next) {
        try {
            const userId = req.user?.userId;
            const user = await services_1.UserService.getUserProfile(userId);
            res.status(200).json((0, utils_1.successResponse)(user));
        }
        catch (error) {
            logger_1.logger.error('Get my profile controller error', error);
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map