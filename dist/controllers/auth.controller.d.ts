import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    static register(req: Request, res: Response, next: NextFunction): Promise<void>;
    static login(req: Request, res: Response, next: NextFunction): Promise<void>;
    static refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    static logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
    static requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void>;
    static resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    static changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    static resendVerificationCode(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default AuthController;
//# sourceMappingURL=auth.controller.d.ts.map