"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpService = void 0;
const models_1 = require("../models");
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
class HelpService {
    static async processUserQuery(input) {
        try {
            if (!input)
                throw new error_types_1.ValidationError('Input cannot be empty');
            const normalizedInput = input.toLowerCase().trim();
            const knowledgeBase = await models_1.Help.find({ isActive: true }).select('question answer keywords category');
            let bestMatch = null;
            let maxMatchedKeywords = 0;
            for (const rule of knowledgeBase) {
                const matchedCount = rule.keywords.filter(k => normalizedInput.includes(k.toLowerCase())).length;
                if (matchedCount > 0 && matchedCount > maxMatchedKeywords) {
                    maxMatchedKeywords = matchedCount;
                    bestMatch = rule;
                }
            }
            if (bestMatch) {
                await models_1.Help.findByIdAndUpdate(bestMatch._id, { $inc: { views: 1 } });
                return {
                    status: 'matched',
                    data: { question: bestMatch.question, answer: bestMatch.answer, category: bestMatch.category, relevance: 'high' }
                };
            }
            return {
                status: 'fallback',
                data: {
                    question: 'Unknown',
                    answer: 'Sorry, I do not understand. Please contact admin.',
                    category: 'general',
                    relevance: 'none'
                }
            };
        }
        catch (error) {
            logger_1.logger.error('Rule-based processing error', error);
            throw error;
        }
    }
    static async createHelpArticle(helpData, createdBy) {
        const help = new models_1.Help({ ...helpData, createdBy, isActive: true, views: 0, helpful: 0, notHelpful: 0 });
        await help.save();
        return help;
    }
    static async getHelpArticleById(helpId) {
        const help = await models_1.Help.findByIdAndUpdate(helpId, { $inc: { views: 1 } }, { new: true }).populate('createdBy', 'fullName');
        if (!help)
            throw new error_types_1.NotFoundError('Help article not found');
        return help;
    }
    static async updateHelpArticle(helpId, updateData, userId) {
        const help = await models_1.Help.findById(helpId);
        if (!help)
            throw new error_types_1.NotFoundError('Help article not found');
        if (help.createdBy.toString() !== userId)
            throw new error_types_1.ForbiddenError('Permission denied');
        Object.assign(help, updateData);
        help.updatedAt = new Date();
        await help.save();
        return help;
    }
    static async deleteHelpArticle(helpId, userId) {
        const help = await models_1.Help.findById(helpId);
        if (!help)
            throw new error_types_1.NotFoundError('Help article not found');
        if (help.createdBy.toString() !== userId)
            throw new error_types_1.ForbiddenError('Permission denied');
        await models_1.Help.deleteOne({ _id: helpId });
        return { message: 'Deleted' };
    }
    static async searchByKeywords(query, page, limit) {
        const skip = (page - 1) * limit;
        const searchQuery = { isActive: true, $or: [{ question: { $regex: query, $options: 'i' } }, { keywords: { $in: [new RegExp(query, 'i')] } }] };
        const total = await models_1.Help.countDocuments(searchQuery);
        const articles = await models_1.Help.find(searchQuery).select('-answer').skip(skip).limit(limit).sort({ views: -1 });
        return { articles, total, page, limit, pages: Math.ceil(total / limit) };
    }
    static async getByCategory(category, page, limit) {
        const skip = (page - 1) * limit;
        const total = await models_1.Help.countDocuments({ category, isActive: true });
        const articles = await models_1.Help.find({ category, isActive: true }).skip(skip).limit(limit).sort({ views: -1 });
        return { articles, total, page, limit, pages: Math.ceil(total / limit) };
    }
    static async markAsHelpful(helpId) { return await models_1.Help.findByIdAndUpdate(helpId, { $inc: { helpful: 1 } }, { new: true }); }
    static async markAsNotHelpful(helpId) { return await models_1.Help.findByIdAndUpdate(helpId, { $inc: { notHelpful: 1 } }, { new: true }); }
    static async getCategories() {
        return await models_1.Help.aggregate([{ $match: { isActive: true } }, { $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
    }
    static async getHelpStats() {
        const stats = await models_1.Help.aggregate([{ $match: { isActive: true } }, { $group: { _id: null, total: { $sum: 1 }, views: { $sum: "$views" }, helpful: { $sum: "$helpful" } } }]);
        return stats[0] || {};
    }
}
exports.HelpService = HelpService;
exports.default = HelpService;
//# sourceMappingURL=help.service.js.map