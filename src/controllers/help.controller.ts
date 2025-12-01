import { Request, Response, NextFunction } from 'express';
import { HelpService } from '../services';
import { successResponse, paginatedResponse, createdResponse, deletedResponse } from '../utils';
import { logger } from '../utils/logger';

export class HelpController {
  static async askHelp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) { res.status(400).json({ success: false, error: 'Query is required' }); return; }
      const result = await HelpService.processUserQuery(query);
      res.status(200).json(successResponse(result, 'Help query processed'));
    } catch (error) {
      logger.error('Ask help controller error', error);
      next(error);
    }
  }

  static async createHelpArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const help = await HelpService.createHelpArticle(req.body, userId);
      res.status(201).json(createdResponse(help, 'Created successfully'));
    } catch (error) {
      logger.error('Create help controller error', error);
      next(error);
    }
  }

  static async getHelpArticleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const help = await HelpService.getHelpArticleById(id);
      res.status(200).json(successResponse(help));
    } catch (error) {
      logger.error('Get help controller error', error);
      next(error);
    }
  }

  static async searchByKeywords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      if (!query) { res.status(400).json({ success: false, error: 'Query required' }); return; }
      const result = await HelpService.searchByKeywords(query, page, limit);
      res.status(200).json(paginatedResponse(result.articles, result.total, result.page, result.limit));
    } catch (error) {
      logger.error('Search help controller error', error);
      next(error);
    }
  }

  static async getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await HelpService.getByCategory(category, page, limit);
      res.status(200).json(paginatedResponse(result.articles, result.total, result.page, result.limit));
    } catch (error) {
      logger.error('Get category controller error', error);
      next(error);
    }
  }

  static async updateHelpArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const help = await HelpService.updateHelpArticle(id, req.body, userId);
      res.status(200).json(successResponse(help, 'Updated successfully'));
    } catch (error) {
      logger.error('Update help controller error', error);
      next(error);
    }
  }

  static async deleteHelpArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const result = await HelpService.deleteHelpArticle(id, userId);
      res.status(200).json(deletedResponse(result.message));
    } catch (error) {
      logger.error('Delete help controller error', error);
      next(error);
    }
  }

  static async markAsHelpful(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const help = await HelpService.markAsHelpful(id);
      res.status(200).json(successResponse(help));
    } catch (error) {
      logger.error('Mark helpful controller error', error);
      next(error);
    }
  }

  static async markAsNotHelpful(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const help = await HelpService.markAsNotHelpful(id);
      res.status(200).json(successResponse(help));
    } catch (error) {
      logger.error('Mark not helpful controller error', error);
      next(error);
    }
  }

  static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await HelpService.getCategories();
      res.status(200).json(successResponse(result));
    } catch (error) {
      logger.error('Get categories controller error', error);
      next(error);
    }
  }

  static async getHelpStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await HelpService.getHelpStats();
      res.status(200).json(successResponse(result));
    } catch (error) {
      logger.error('Get stats controller error', error);
      next(error);
    }
  }
}

export default HelpController;