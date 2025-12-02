import { Request, Response, NextFunction } from 'express';
export declare class HelpController {
    static askHelp(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createHelpArticle(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getHelpArticleById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchByKeywords(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getByCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateHelpArticle(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteHelpArticle(req: Request, res: Response, next: NextFunction): Promise<void>;
    static markAsHelpful(req: Request, res: Response, next: NextFunction): Promise<void>;
    static markAsNotHelpful(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCategories(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getHelpStats(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default HelpController;
//# sourceMappingURL=help.controller.d.ts.map