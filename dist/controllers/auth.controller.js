"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
class AuthController {
    static async register(req, res, next) {
        try {
            const { fullName, username, email, password, confirmPassword } = req.body;
            if (!fullName || !username || !email || !password || !confirmPassword) {
                res.status(400).json({ success: false, error: 'All fields are required' });
                return;
            }
            if (password !== confirmPassword) {
                res.status(400).json({ success: false, error: 'Passwords do not match' });
                return;
            }
            const user = await services_1.AuthService.register(fullName, username, email, password);
            res.status(201).json((0, utils_1.createdResponse)(user, 'User registered successfully'));
        }
        catch (error) {
            logger_1.logger.error('Register controller error', error);
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { usernameOrEmail, password } = req.body;
            if (!usernameOrEmail || !password) {
                res.status(400).json({ success: false, error: 'Username/Email and password are required' });
                return;
            }
            const result = await services_1.AuthService.login(usernameOrEmail, password);
            res.status(200).json((0, utils_1.successResponse)(result, 'Login successful'));
        }
        catch (error) {
            logger_1.logger.error('Login controller error', error);
            next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ success: false, error: 'Refresh token is required' });
                return;
            }
            const tokens = await services_1.AuthService.refreshToken(refreshToken);
            res.status(200).json((0, utils_1.successResponse)(tokens, 'Token refreshed successfully'));
        }
        catch (error) {
            logger_1.logger.error('Refresh token controller error', error);
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Authentication required' });
                return;
            }
            const result = await services_1.AuthService.logout(userId);
            res.status(200).json((0, utils_1.successResponse)(result, 'Logged out successfully'));
        }
        catch (error) {
            logger_1.logger.error('Logout controller error', error);
            next(error);
        }
    }
    static async verifyEmail(req, res, next) {
        try {
            const { email, activationCode } = req.body;
            if (!email || !activationCode) {
                res.status(400).json({ success: false, error: 'Email and activation code are required' });
                return;
            }
            const result = await services_1.AuthService.verifyEmail(email, activationCode);
            res.status(200).json((0, utils_1.successResponse)(result, 'Email verified successfully'));
        }
        catch (error) {
            logger_1.logger.error('Verify email controller error', error);
            next(error);
        }
    }
    static async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, error: 'Email is required' });
                return;
            }
            const result = await services_1.AuthService.requestPasswordReset(email);
            res.status(200).json((0, utils_1.successResponse)(result));
        }
        catch (error) {
            logger_1.logger.error('Forgot password controller error', error);
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { email, token, newPassword, confirmPassword } = req.body;
            if (!email || !token || !newPassword || !confirmPassword) {
                res.status(400).json({ success: false, error: 'All fields are required' });
                return;
            }
            if (newPassword !== confirmPassword) {
                res.status(400).json({ success: false, error: 'Passwords do not match' });
                return;
            }
            const result = await services_1.AuthService.resetPassword(email, token, newPassword);
            res.status(200).json((0, utils_1.successResponse)(result));
        }
        catch (error) {
            logger_1.logger.error('Reset password controller error', error);
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            const userId = req.user?.userId;
            const { currentPassword, newPassword, confirmPassword } = req.body;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Authentication required' });
                return;
            }
            if (!currentPassword || !newPassword || !confirmPassword) {
                res.status(400).json({ success: false, error: 'All fields are required' });
                return;
            }
            if (newPassword !== confirmPassword) {
                res.status(400).json({ success: false, error: 'Passwords do not match' });
                return;
            }
            const result = await services_1.AuthService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json((0, utils_1.successResponse)(result));
        }
        catch (error) {
            logger_1.logger.error('Change password controller error', error);
            next(error);
        }
    }
    static async resendVerificationCode(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, error: 'Email is required' });
                return;
            }
            const result = await services_1.AuthService.resendVerificationCode(email);
            res.status(200).json((0, utils_1.successResponse)(result, 'Verification code resent successfully'));
        }
        catch (error) {
            logger_1.logger.error('Resend code controller error', error);
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map