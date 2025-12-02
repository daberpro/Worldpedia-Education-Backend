import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import config from '../config/env';
import { 
  UnauthorizedError, 
  ConflictError, 
  NotFoundError
} from '../types/error.types';
import { logger } from '../utils/logger';
import EmailService from './email.service';

export class AuthService {
  static async register(fullName: string, username: string, email: string, password: string) {
    try {
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
      });

      if (existingUser) {
        const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
        throw new ConflictError(`User with this ${field} already exists`);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      
      const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const activationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

      const user = new User({
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
      await EmailService.sendVerificationEmail(email, fullName, activationCode, verificationLink);

      logger.info(`User registered: ${email}`);

      return {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      logger.error('Registration error', error);
      throw error;
    }
  }

  static async login(usernameOrEmail: string, password: string) {
    try {
      const user = await User.findOne({
        $or: [
          { email: usernameOrEmail.toLowerCase() },
          { username: usernameOrEmail.toLowerCase() }
        ]
      }).select('+password');

      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      if (user.isAccountLocked()) {
        throw new UnauthorizedError('Account is locked. Please try again later');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        user.incLoginAttempts();
        await user.save();
        throw new UnauthorizedError('Invalid credentials');
      }

      user.resetLoginAttempts();
      await user.save();

      user.lastLogin = new Date();
      await user.save();

      logger.logAuth('login', user._id.toString(), true);

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
    } catch (error) {
      logger.error('Login error', error);
      throw error;
    }
  }

  static generateTokens(user: any): { accessToken: string; refreshToken: string } {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role
    };

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: config.jwtAccessExpiry
    } as SignOptions);

    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiry } as SignOptions
    );

    return { accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const tokens = this.generateTokens(user);
      logger.info(`Token refreshed for user: ${user._id}`);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    } catch (error) {
      logger.error('Token refresh error', error);
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  static async logout(userId: string) {
    try {
      const user = await User.findById(userId);
      if (user) {
        user.lastLogout = new Date();
        await user.save();
      }
      logger.logAuth('logout', userId, true);
      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Logout error', error);
      throw error;
    }
  }

  static async verifyEmail(email: string, activationCode: string) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) throw new NotFoundError('User not found');
      if (user.isVerified) return { message: 'Email already verified' };
      if (user.activationCode !== activationCode) throw new UnauthorizedError('Invalid activation code');
      if (user.activationExpire && user.activationExpire < new Date()) throw new UnauthorizedError('Activation code has expired');

      user.isVerified = true;
      user.activationCode = null as any;
      user.activationExpire = null as any;
      await user.save();

      return { message: 'Email verified successfully' };
    } catch (error) {
      logger.error('Email verification error', error);
      throw error;
    }
  }

  static async requestPasswordReset(email: string) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return { message: 'If user exists, password reset link will be sent' };

      const resetToken = jwt.sign(
        { userId: user._id.toString(), type: 'reset' },
        config.jwtAccessSecret,
        { expiresIn: '1h' } as SignOptions
      );

      user.resetToken = resetToken;
      user.resetExpire = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      return { message: 'Password reset link sent to email', resetToken };
    } catch (error) {
      logger.error('Password reset request error', error);
      throw error;
    }
  }

  static async resetPassword(email: string, token: string, newPassword: string) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) throw new NotFoundError('User not found');
      if (!user.resetToken || user.resetToken !== token) throw new UnauthorizedError('Invalid reset token');
      if (user.resetExpire && user.resetExpire < new Date()) throw new UnauthorizedError('Reset token has expired');

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.resetToken = null as any;
      user.resetExpire = null as any;
      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      logger.error('Password reset error', error);
      throw error;
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) throw new NotFoundError('User not found');

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) throw new UnauthorizedError('Current password is incorrect');

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Change password error', error);
      throw error;
    }
  }

  static async resendVerificationCode(email: string) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        throw new NotFoundError('User not found');
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
      await EmailService.sendVerificationEmail(
        user.email,
        user.fullName,
        activationCode,
        verificationLink
      );

      logger.info(`Verification code resent to: ${email}`);
      return { message: 'Verification code sent successfully' };
    } catch (error) {
      logger.error('Resend verification code error', error);
      throw error;
    }
  }
}

export default AuthService;