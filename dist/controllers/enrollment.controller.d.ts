import { Request, Response, NextFunction } from 'express';
export declare class EnrollmentController {
    static createEnrollment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getEnrollmentById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStudentEnrollments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateEnrollmentStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    static cancelEnrollment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getProgressSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMyEnrollments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllEnrollments(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default EnrollmentController;
//# sourceMappingURL=enrollment.controller.d.ts.map