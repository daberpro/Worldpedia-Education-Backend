import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { successResponse, createdResponse } from '../utils';
import { logger } from '../utils/logger';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const user = await AuthService.register(fullName, username, email, password);
      res.status(201).json(createdResponse(user, 'User registered successfully'));
    } catch (error) {
      logger.error('Register controller error', error);
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { usernameOrEmail, password } = req.body;
      if (!usernameOrEmail || !password) {
        res.status(400).json({ success: false, error: 'Username/Email and password are required' });
        return;
      }
      const result = await AuthService.login(usernameOrEmail, password);
      res.status(200).json(successResponse(result, 'Login successful'));
    } catch (error) {
      logger.error('Login controller error', error);
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ success: false, error: 'Refresh token is required' });
        return;
      }
      const tokens = await AuthService.refreshToken(refreshToken);
      res.status(200).json(successResponse(tokens, 'Token refreshed successfully'));
    } catch (error) {
      logger.error('Refresh token controller error', error);
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }
      const result = await AuthService.logout(userId);
      res.status(200).json(successResponse(result, 'Logged out successfully'));
    } catch (error) {
      logger.error('Logout controller error', error);
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, activationCode } = req.body;
      if (!email || !activationCode) {
        res.status(400).json({ success: false, error: 'Email and activation code are required' });
        return;
      }
      const result = await AuthService.verifyEmail(email, activationCode);
      res.status(200).json(successResponse(result, 'Email verified successfully'));
    } catch (error) {
      logger.error('Verify email controller error', error);
      next(error);
    }
  }

  static async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ success: false, error: 'Email is required' });
        return;
      }
      const result = await AuthService.requestPasswordReset(email);
      res.status(200).json(successResponse(result));
    } catch (error) {
      logger.error('Forgot password controller error', error);
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      const result = await AuthService.resetPassword(email, token, newPassword);
      res.status(200).json(successResponse(result));
    } catch (error) {
      logger.error('Reset password controller error', error);
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
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
      const result = await AuthService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json(successResponse(result));
    } catch (error) {
      logger.error('Change password controller error', error);
      next(error);
    }
  }

  static async resendVerificationCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ success: false, error: 'Email is required' });
        return;
      }
      const result = await AuthService.resendVerificationCode(email);
      res.status(200).json(successResponse(result, 'Verification code resent successfully'));
    } catch (error) {
      logger.error('Resend code controller error', error);
      next(error);
    }
  }
}

export default AuthController;