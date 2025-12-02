"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const env_1 = __importDefault(require("../config/env"));
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
const email_service_1 = __importDefault(require("./email.service"));
class AuthService {
    static async register(fullName, username, email, password) {
        try {
            const existingUser = await models_1.User.findOne({
                $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
            });
            if (existingUser) {
                const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
                throw new error_types_1.ConflictError(`User with this ${field} already exists`);
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const activationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam
            const user = new models_1.User({
                fullName,
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'student',
                isVerified: false,
                activationCode,
                activationExpire
            });
            await user.save();
            const verificationLink = `http://localhost:3000/verify?email=${email}&code=${activationCode}`;
            await email_service_1.default.sendVerificationEmail(email, fullName, activationCode, verificationLink);
            logger_1.logger.info(`User registered: ${email}`);
            return {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role
            };
        }
        catch (error) {
            logger_1.logger.error('Registration error', error);
            throw error;
        }
    }
    static async login(usernameOrEmail, password) {
        try {
            const user = await models_1.User.findOne({
                $or: [
                    { email: usernameOrEmail.toLowerCase() },
                    { username: usernameOrEmail.toLowerCase() }
                ]
            }).select('+password');
            if (!user) {
                throw new error_types_1.UnauthorizedError('Invalid credentials');
            }
            if (user.isAccountLocked()) {
                throw new error_types_1.UnauthorizedError('Account is locked. Please try again later');
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                user.incLoginAttempts();
                await user.save();
                throw new error_types_1.UnauthorizedError('Invalid credentials');
            }
            user.resetLoginAttempts();
            await user.save();
            user.lastLogin = new Date();
            await user.save();
            logger_1.logger.logAuth('login', user._id.toString(), true);
            const tokens = this.generateTokens(user);
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    avatar: user.avatar
                }
            };
        }
        catch (error) {
            logger_1.logger.error('Login error', error);
            throw error;
        }
    }
    static generateTokens(user) {
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, env_1.default.jwtAccessSecret, {
            expiresIn: env_1.default.jwtAccessExpiry
        });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, env_1.default.jwtRefreshSecret, { expiresIn: env_1.default.jwtRefreshExpiry });
        return { accessToken, refreshToken };
    }
    static async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.default.jwtRefreshSecret);
            const user = await models_1.User.findById(decoded.userId);
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            const tokens = this.generateTokens(user);
            logger_1.logger.info(`Token refreshed for user: ${user._id}`);
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        }
        catch (error) {
            logger_1.logger.error('Token refresh error', error);
            throw new error_types_1.UnauthorizedError('Invalid or expired refresh token');
        }
    }
    static async logout(userId) {
        try {
            const user = await models_1.User.findById(userId);
            if (user) {
                user.lastLogout = new Date();
                await user.save();
            }
            logger_1.logger.logAuth('logout', userId, true);
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            logger_1.logger.error('Logout error', error);
            throw error;
        }
    }
    static async verifyEmail(email, activationCode) {
        try {
            const user = await models_1.User.findOne({ email: email.toLowerCase() });
            if (!user)
                throw new error_types_1.NotFoundError('User not found');
            if (user.isVerified)
                return { message: 'Email already verified' };
            if (user.activationCode !== activationCode)
                throw new error_types_1.UnauthorizedError('Invalid activation code');
            if (user.activationExpire && user.activationExpire < new Date())
                throw new error_types_1.UnauthorizedError('Activation code has expired');
            user.isVerified = true;
            user.activationCode = null;
            user.activationExpire = null;
            await user.save();
            return { message: 'Email verified successfully' };
        }
        catch (error) {
            logger_1.logger.error('Email verification error', error);
            throw error;
        }
    }
    static async requestPasswordReset(email) {
        try {
            const user = await models_1.User.findOne({ email: email.toLowerCase() });
            if (!user)
                return { message: 'If user exists, password reset link will be sent' };
            const resetToken = jsonwebtoken_1.default.sign({ userId: user._id.toString(), type: 'reset' }, env_1.default.jwtAccessSecret, { expiresIn: '1h' });
            user.resetToken = resetToken;
            user.resetExpire = new Date(Date.now() + 60 * 60 * 1000);
            await user.save();
            return { message: 'Password reset link sent to email', resetToken };
        }
        catch (error) {
            logger_1.logger.error('Password reset request error', error);
            throw error;
        }
    }
    static async resetPassword(email, token, newPassword) {
        try {
            const user = await models_1.User.findOne({ email: email.toLowerCase() });
            if (!user)
                throw new error_types_1.NotFoundError('User not found');
            if (!user.resetToken || user.resetToken !== token)
                throw new error_types_1.UnauthorizedError('Invalid reset token');
            if (user.resetExpire && user.resetExpire < new Date())
                throw new error_types_1.UnauthorizedError('Reset token has expired');
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
            user.password = hashedPassword;
            user.resetToken = null;
            user.resetExpire = null;
            await user.save();
            return { message: 'Password reset successfully' };
        }
        catch (error) {
            logger_1.logger.error('Password reset error', error);
            throw error;
        }
    }
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await models_1.User.findById(userId).select('+password');
            if (!user)
                throw new error_types_1.NotFoundError('User not found');
            const isValid = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isValid)
                throw new error_types_1.UnauthorizedError('Current password is incorrect');
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
            user.password = hashedPassword;
            await user.save();
            return { message: 'Password changed successfully' };
        }
        catch (error) {
            logger_1.logger.error('Change password error', error);
            throw error;
        }
    }
    static async resendVerificationCode(email) {
        try {
            const user = await models_1.User.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw new error_types_1.NotFoundError('User not found');
            }
            if (user.isVerified) {
                return { message: 'Email already verified' };
            }
            const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const activationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
            user.activationCode = activationCode;
            user.activationExpire = activationExpire;
            await user.save();
            const verificationLink = `http://localhost:3000/verify?email=${user.email}&code=${activationCode}`;
            await email_service_1.default.sendVerificationEmail(user.email, user.fullName, activationCode, verificationLink);
            logger_1.logger.info(`Verification code resent to: ${email}`);
            return { message: 'Verification code sent successfully' };
        }
        catch (error) {
            logger_1.logger.error('Resend verification code error', error);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map