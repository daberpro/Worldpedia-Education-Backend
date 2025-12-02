import { Request, Response, NextFunction } from 'express';
/**
 * Form Controller - Handles form creation and submission endpoints
 */
export declare class FormController {
    /**
     * Create form
     * POST /api/forms
     */
    static createForm(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get form by ID
     * GET /api/forms/:id
     */
    static getFormById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get forms by course
     * GET /api/forms/course/:courseId
     */
    static getFormsByCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update form
     * PUT /api/forms/:id
     */
    static updateForm(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete form
     * DELETE /api/forms/:id
     */
    static deleteForm(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Submit form
     * POST /api/forms/:id/submit
     */
    static submitForm(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get form submissions
     * GET /api/forms/:id/submissions
     */
    static getFormSubmissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get student submission
     * GET /api/forms/:id/my-submission
     */
    static getStudentSubmission(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get form analytics
     * GET /api/forms/:id/analytics
     */
    static getFormAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default FormController;
//# sourceMappingURL=form.controller.d.ts.map