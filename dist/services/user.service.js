"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const models_1 = require("../models");
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
/**
 * User Service - Handles user profile management
 */
class UserService {
    /**
     * Get user profile
     */
    static async getUserProfile(userId) {
        try {
            const user = await models_1.User.findById(userId).select('-password -resetToken -activationCode');
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            return user;
        }
        catch (error) {
            logger_1.logger.error('Get user profile error', error);
            throw error;
        }
    }
    /**
     * Update user profile
     */
    static async updateUserProfile(userId, updateData) {
        try {
            const user = await models_1.User.findById(userId);
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            // Only allow specific fields to be updated
            const allowedFields = ['fullName', 'avatar'];
            const filteredData = Object.keys(updateData)
                .filter(key => allowedFields.includes(key))
                .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});
            Object.assign(user, filteredData);
            await user.save();
            logger_1.logger.info(`User profile updated: ${userId}`);
            return user;
        }
        catch (error) {
            logger_1.logger.error('Update user profile error', error);
            throw error;
        }
    }
    /**
     * Get user by username
     */
    static async getUserByUsername(username) {
        try {
            const user = await models_1.User.findOne({ username: username.toLowerCase() })
                .select('-password -resetToken -activationCode');
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            return user;
        }
        catch (error) {
            logger_1.logger.error('Get user by username error', error);
            throw error;
        }
    }
    /**
     * Get all users with pagination
     */
    static async getAllUsers(page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            const query = {};
            if (filters.role)
                query.role = filters.role;
            if (filters.isVerified !== undefined)
                query.isVerified = filters.isVerified;
            if (filters.search) {
                query.$or = [
                    { fullName: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } },
                    { username: { $regex: filters.search, $options: 'i' } }
                ];
            }
            const total = await models_1.User.countDocuments(query);
            const users = await models_1.User.find(query)
                .select('-password -resetToken -activationCode')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            return {
                users,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Get all users error', error);
            throw error;
        }
    }
    /**
     * Update user role (admin only)
     */
    static async updateUserRole(userId, newRole) {
        try {
            const validRoles = ['student', 'admin'];
            if (!validRoles.includes(newRole)) {
                throw new error_types_1.ValidationError('Invalid role', { role: `Role must be one of: ${validRoles.join(', ')}` });
            }
            const user = await models_1.User.findById(userId);
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            user.role = newRole;
            await user.save();
            logger_1.logger.info(`User role updated: ${userId} - New role: ${newRole}`);
            return user;
        }
        catch (error) {
            logger_1.logger.error('Update user role error', error);
            throw error;
        }
    }
    /**
     * Delete user account
     */
    static async deleteUserAccount(userId, requestingUserId) {
        try {
            // Check authorization - only user or admin can delete
            if (userId !== requestingUserId) {
                throw new error_types_1.ForbiddenError('You do not have permission to delete this account');
            }
            const user = await models_1.User.findById(userId);
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            await models_1.User.deleteOne({ _id: userId });
            logger_1.logger.info(`User account deleted: ${userId}`);
            return { message: 'Account deleted successfully' };
        }
        catch (error) {
            logger_1.logger.error('Delete user account error', error);
            throw error;
        }
    }
    /**
     * Lock/Unlock user account
     */
    static async lockUnlockAccount(userId, lock) {
        try {
            const user = await models_1.User.findById(userId);
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            user.isLocked = lock;
            if (!lock) {
                user.lockUntil = null;
                user.loginAttempts = 0;
            }
            await user.save();
            const action = lock ? 'locked' : 'unlocked';
            logger_1.logger.info(`User account ${action}: ${userId}`);
            return { message: `Account ${action} successfully` };
        }
        catch (error) {
            logger_1.logger.error('Lock/Unlock account error', error);
            throw error;
        }
    }
    /**
     * Get user statistics
     */
    static async getUserStats(userId) {
        try {
            const user = await models_1.User.findById(userId)
                .select('-password -resetToken -activationCode');
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            return {
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLogin: user.lastLogin,
                lastLogout: user.lastLogout,
                isLocked: user.isLocked,
                loginAttempts: user.loginAttempts
            };
        }
        catch (error) {
            logger_1.logger.error('Get user stats error', error);
            throw error;
        }
    }
    /**
     * Search users
     */
    static async searchUsers(query, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const searchQuery = {
                $or: [
                    { fullName: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } }
                ]
            };
            const total = await models_1.User.countDocuments(searchQuery);
            const users = await models_1.User.find(searchQuery)
                .select('-password -resetToken -activationCode')
                .skip(skip)
                .limit(limit);
            return {
                users,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            logger_1.logger.error('Search users error', error);
            throw error;
        }
    }
    /**
     * Get user activity log
     */
    static async getUserActivityLog(userId) {
        try {
            const user = await models_1.User.findById(userId);
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            return {
                userId: user._id,
                lastLogin: user.lastLogin,
                lastLogout: user.lastLogout,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isLocked: user.isLocked,
                lockUntil: user.lockUntil,
                loginAttempts: user.loginAttempts
            };
        }
        catch (error) {
            logger_1.logger.error('Get user activity log error', error);
            throw error;
        }
    }
    /**
     * Bulk update users (admin only)
     */
    static async bulkUpdateUsers(userIds, updateData) {
        try {
            const allowedFields = ['role', 'isLocked'];
            const filteredData = Object.keys(updateData)
                .filter(key => allowedFields.includes(key))
                .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});
            const result = await models_1.User.updateMany({ _id: { $in: userIds } }, filteredData);
            logger_1.logger.info(`Bulk updated users: ${userIds.length}`);
            return {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount
            };
        }
        catch (error) {
            logger_1.logger.error('Bulk update users error', error);
            throw error;
        }
    }
}
exports.UserService = UserService;
exports.default = UserService;
//# sourceMappingURL=user.service.js.map