import { Help } from '../models';
import { NotFoundError, ForbiddenError, ValidationError } from '../types/error.types';
import { logger } from '../utils/logger';

export class HelpService {
  static async processUserQuery(input: string) {
    try {
      if (!input) throw new ValidationError('Input cannot be empty');
      const normalizedInput = input.toLowerCase().trim();
      const knowledgeBase = await Help.find({ isActive: true }).select('question answer keywords category');

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
        await Help.findByIdAndUpdate(bestMatch._id, { $inc: { views: 1 } });
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
    } catch (error) {
      logger.error('Rule-based processing error', error);
      throw error;
    }
  }

  static async createHelpArticle(helpData: any, createdBy: string) {
      const help = new Help({ ...helpData, createdBy, isActive: true, views: 0, helpful: 0, notHelpful: 0 });
      await help.save();
      return help;
  }
  
  static async getHelpArticleById(helpId: string) {
      const help = await Help.findByIdAndUpdate(helpId, { $inc: { views: 1 } }, { new: true }).populate('createdBy', 'fullName');
      if (!help) throw new NotFoundError('Help article not found');
      return help;
  }
  
  static async updateHelpArticle(helpId: string, updateData: any, userId: string) {
      const help = await Help.findById(helpId);
      if (!help) throw new NotFoundError('Help article not found');
      if (help.createdBy.toString() !== userId) throw new ForbiddenError('Permission denied');
      Object.assign(help, updateData);
      help.updatedAt = new Date();
      await help.save();
      return help;
  }

  static async deleteHelpArticle(helpId: string, userId: string) {
      const help = await Help.findById(helpId);
      if (!help) throw new NotFoundError('Help article not found');
      if (help.createdBy.toString() !== userId) throw new ForbiddenError('Permission denied');
      await Help.deleteOne({ _id: helpId });
      return { message: 'Deleted' };
  }
  
  static async searchByKeywords(query: string, page: number, limit: number) {
      const skip = (page - 1) * limit;
      const searchQuery = { isActive: true, $or: [{ question: { $regex: query, $options: 'i' } }, { keywords: { $in: [new RegExp(query, 'i')] } }] };
      const total = await Help.countDocuments(searchQuery);
      const articles = await Help.find(searchQuery).select('-answer').skip(skip).limit(limit).sort({ views: -1 });
      return { articles, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getByCategory(category: string, page: number, limit: number) {
      const skip = (page - 1) * limit;
      const total = await Help.countDocuments({ category, isActive: true });
      const articles = await Help.find({ category, isActive: true }).skip(skip).limit(limit).sort({ views: -1 });
      return { articles, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async markAsHelpful(helpId: string) { return await Help.findByIdAndUpdate(helpId, { $inc: { helpful: 1 } }, { new: true }); }
  static async markAsNotHelpful(helpId: string) { return await Help.findByIdAndUpdate(helpId, { $inc: { notHelpful: 1 } }, { new: true }); }

  static async getCategories() {
      return await Help.aggregate([{ $match: { isActive: true } }, { $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
  }

  static async getHelpStats() {
      const stats = await Help.aggregate([{ $match: { isActive: true } }, { $group: { _id: null, total: { $sum: 1 }, views: { $sum: "$views" }, helpful: { $sum: "$helpful" } } }]);
      return stats[0] || {};
  }
}

export default HelpService;