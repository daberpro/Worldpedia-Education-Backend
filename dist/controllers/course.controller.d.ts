import { Request, Response, NextFunction } from 'express';
/**
 * Course Controller - Handles course management endpoints
 */
export declare class CourseController {
    /**
     * Create new course
     * POST /api/courses
     */
    static createCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get course by ID
     * GET /api/courses/:id
     */
    static getCourseById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all courses with pagination
     * GET /api/courses
     */
    static getAllCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update course
     * PUT /api/courses/:id
     */
    static updateCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete course
     * DELETE /api/courses/:id
     */
    static deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get course enrollments
     * GET /api/courses/:id/enrollments
     */
    static getCourseEnrollments(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get course statistics
     * GET /api/courses/:id/stats
     */
    static getCourseStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Search courses
     * GET /api/courses/search
     */
    static searchCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default CourseController;
//# sourceMappingURL=course.controller.d.ts.map