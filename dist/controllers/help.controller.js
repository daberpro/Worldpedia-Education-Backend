"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
class HelpController {
    static async askHelp(req, res, next) {
        try {
            const { query } = req.body;
            if (!query) {
                res.status(400).json({ success: false, error: 'Query is required' });
                return;
            }
            const result = await services_1.HelpService.processUserQuery(query);
            res.status(200).json((0, utils_1.successResponse)(result, 'Help query processed'));
        }
        catch (error) {
            logger_1.logger.error('Ask help controller error', error);
            next(error);
        }
    }
    static async createHelpArticle(req, res, next) {
        try {
            const userId = req.user?.userId;
            const help = await services_1.HelpService.createHelpArticle(req.body, userId);
            res.status(201).json((0, utils_1.createdResponse)(help, 'Created successfully'));
        }
        catch (error) {
            logger_1.logger.error('Create help controller error', error);
            next(error);
        }
    }
    static async getHelpArticleById(req, res, next) {
        try {
            const { id } = req.params;
            const help = await services_1.HelpService.getHelpArticleById(id);
            res.status(200).json((0, utils_1.successResponse)(help));
        }
        catch (error) {
            logger_1.logger.error('Get help controller error', error);
            next(error);
        }
    }
    static async searchByKeywords(req, res, next) {
        try {
            const query = req.query.q;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!query) {
                res.status(400).json({ success: false, error: 'Query required' });
                return;
            }
            const result = await services_1.HelpService.searchByKeywords(query, page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.articles, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Search help controller error', error);
            next(error);
        }
    }
    static async getByCategory(req, res, next) {
        try {
            const { category } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await services_1.HelpService.getByCategory(category, page, limit);
            res.status(200).json((0, utils_1.paginatedResponse)(result.articles, result.total, result.page, result.limit));
        }
        catch (error) {
            logger_1.logger.error('Get category controller error', error);
            next(error);
        }
    }
    static async updateHelpArticle(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const help = await services_1.HelpService.updateHelpArticle(id, req.body, userId);
            res.status(200).json((0, utils_1.successResponse)(help, 'Updated successfully'));
        }
        catch (error) {
            logger_1.logger.error('Update help controller error', error);
            next(error);
        }
    }
    static async deleteHelpArticle(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const result = await services_1.HelpService.deleteHelpArticle(id, userId);
            res.status(200).json((0, utils_1.deletedResponse)(result.message));
        }
        catch (error) {
            logger_1.logger.error('Delete help controller error', error);
            next(error);
        }
    }
    static async markAsHelpful(req, res, next) {
        try {
            const { id } = req.params;
            const help = await services_1.HelpService.markAsHelpful(id);
            res.status(200).json((0, utils_1.successResponse)(help));
        }
        catch (error) {
            logger_1.logger.error('Mark helpful controller error', error);
            next(error);
        }
    }
    static async markAsNotHelpful(req, res, next) {
        try {
            const { id } = req.params;
            const help = await services_1.HelpService.markAsNotHelpful(id);
            res.status(200).json((0, utils_1.successResponse)(help));
        }
        catch (error) {
            logger_1.logger.error('Mark not helpful controller error', error);
            next(error);
        }
    }
    static async getCategories(_req, res, next) {
        try {
            const result = await services_1.HelpService.getCategories();
            res.status(200).json((0, utils_1.successResponse)(result));
        }
        catch (error) {
            logger_1.logger.error('Get categories controller error', error);
            next(error);
        }
    }
    static async getHelpStats(_req, res, next) {
        try {
            const result = await services_1.HelpService.getHelpStats();
            res.status(200).json((0, utils_1.successResponse)(result));
        }
        catch (error) {
            logger_1.logger.error('Get stats controller error', error);
            next(error);
        }
    }
}
exports.HelpController = HelpController;
exports.default = HelpController;
//# sourceMappingURL=help.controller.js.map