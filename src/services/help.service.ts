import { Help } from '../models';
import { NotFoundError, ForbiddenError, ValidationError } from '../types/error.types';
import { logger } from '../utils/logger';

/**
 * Help Service - Rule-Based Assistance Implementation
 * Based on Crisp Logic & Pattern Matching Algorithm
 */
export class HelpService {
  
  /**
   * [RULE-BASED ENGINE]
   * Memproses input pengguna menggunakan pencocokan pola deterministik.
   * * Algoritma:
   * 1. Normalisasi Input.
   * 2. Ambil Basis Pengetahuan (Rules).
   * 3. Evaluasi Antecedent (IF keyword matched).
   * 4. Eksekusi Consequent (THEN return answer).
   * 5. Fallback jika nilai kebenaran 0.
   */
  static async processUserQuery(input: string) {
    try {
      if (!input) throw new ValidationError('Pertanyaan tidak boleh kosong');

      // 1. Normalisasi (Preprocessing)
      const normalizedInput = input.toLowerCase().trim();

      // 2. Ambil Basis Pengetahuan (Hanya rule yang aktif)
      const knowledgeBase = await Help.find({ isActive: true })
        .select('question answer keywords category');

      let bestMatch = null;
      let maxMatchedKeywords = 0;

      // 3. Mekanisme Pencocokan Pola (Pattern Matching)
      for (const rule of knowledgeBase) {
        // Logika Tegas (Crisp Logic): Bernilai 1 jika keyword ditemukan, 0 jika tidak
        const matchedCount = rule.keywords.filter(keyword => 
          normalizedInput.includes(keyword.toLowerCase())
        ).length;

        // Seleksi aturan dengan bobot kecocokan tertinggi (Priority Selection)
        if (matchedCount > 0 && matchedCount > maxMatchedKeywords) {
          maxMatchedKeywords = matchedCount;
          bestMatch = rule;
        }
      }

      // 4. Konsekuensi (THEN) - Jika pola ditemukan (Nilai Kebenaran = 1)
      if (bestMatch) {
        // Update statistik penggunaan
        await Help.findByIdAndUpdate(bestMatch._id, { $inc: { views: 1 } });

        return {
          status: 'success',
          matchType: 'exact_rule',
          data: {
            id: bestMatch._id,
            question: bestMatch.question,
            answer: bestMatch.answer,
            category: bestMatch.category,
            relevanceScore: maxMatchedKeywords
          }
        };
      }

      // 5. Protokol Fallback (Jika Nilai Kebenaran = 0)
      return {
        status: 'fallback',
        matchType: 'none',
        data: {
          question: 'Tidak Ditemukan',
          answer: 'Maaf, sistem tidak mengenali pola pertanyaan Anda. Mohon gunakan kata kunci lain atau hubungi administrator untuk bantuan lebih lanjut.',
          category: 'general',
          relevanceScore: 0
        }
      };

    } catch (error) {
      logger.error('Rule-based processing error', error);
      throw error;
    }
  }

  /**
   * Create help article / rule
   */
  static async createHelpArticle(helpData: any, createdBy: string) {
    try {
      const { question, answer, category, keywords } = helpData;

      if (!question || !answer || !category) {
        throw new ValidationError('Missing required fields');
      }

      const help = new Help({
        question,
        answer,
        category,
        keywords: keywords || [], // Keywords sebagai premis aturan
        createdBy,
        isActive: true,
        views: 0,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await help.save();
      logger.info(`Rule created: ${help._id}`);
      return help;
    } catch (error) {
      logger.error('Create help article error', error);
      throw error;
    }
  }

  /**
   * Get help article by ID
   */
  static async getHelpArticleById(helpId: string) {
    try {
      const help = await Help.findByIdAndUpdate(
        helpId,
        { $inc: { views: 1 } },
        { new: true }
      ).populate('createdBy', 'fullName');

      if (!help) throw new NotFoundError('Help article not found');
      return help;
    } catch (error) {
      logger.error('Get help article error', error);
      throw error;
    }
  }

  /**
   * Search help articles (Legacy/Admin Search)
   */
  static async searchByKeywords(query: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const searchQuery = {
        isActive: true,
        $or: [
          { question: { $regex: query, $options: 'i' } },
          { keywords: { $in: [new RegExp(query, 'i')] } }
        ]
      };

      const total = await Help.countDocuments(searchQuery);
      const articles = await Help.find(searchQuery)
        .select('-answer') // Optimize
        .skip(skip)
        .limit(limit)
        .sort({ views: -1 });

      return {
        articles,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Search help articles error', error);
      throw error;
    }
  }

  /**
   * Get articles by category
   */
  static async getByCategory(category: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const total = await Help.countDocuments({ category, isActive: true });
      const articles = await Help.find({ category, isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ views: -1 });

      return { articles, total, page, limit, pages: Math.ceil(total / limit) };
    } catch (error) {
      logger.error('Get help by category error', error);
      throw error;
    }
  }

  /**
   * Update help article
   */
  static async updateHelpArticle(helpId: string, updateData: any, userId: string) {
    try {
      const help = await Help.findById(helpId);
      if (!help) throw new NotFoundError('Help article not found');

      if (help.createdBy.toString() !== userId) {
        throw new ForbiddenError('Permission denied');
      }

      Object.assign(help, updateData);
      help.updatedAt = new Date();
      await help.save();

      return help;
    } catch (error) {
      logger.error('Update help article error', error);
      throw error;
    }
  }

  /**
   * Delete help article
   */
  static async deleteHelpArticle(helpId: string, userId: string) {
    try {
      const help = await Help.findById(helpId);
      if (!help) throw new NotFoundError('Help article not found');

      if (help.createdBy.toString() !== userId) {
        throw new ForbiddenError('Permission denied');
      }

      await Help.deleteOne({ _id: helpId });
      return { message: 'Help article deleted successfully' };
    } catch (error) {
      logger.error('Delete help article error', error);
      throw error;
    }
  }

  /**
   * Mark as helpful
   */
  static async markAsHelpful(helpId: string) {
    try {
      return await Help.findByIdAndUpdate(helpId, { $inc: { helpful: 1 } }, { new: true });
    } catch (error) {
      logger.error('Mark as helpful error', error);
      throw error;
    }
  }

  /**
   * Mark as not helpful
   */
  static async markAsNotHelpful(helpId: string) {
    try {
      return await Help.findByIdAndUpdate(helpId, { $inc: { notHelpful: 1 } }, { new: true });
    } catch (error) {
      logger.error('Mark as not helpful error', error);
      throw error;
    }
  }

  /**
   * Get categories statistics
   */
  static async getCategories() {
    try {
      return await Help.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { category: "$_id", count: 1, _id: 0 } }
      ]);
    } catch (error) {
      logger.error('Get categories error', error);
      throw error;
    }
  }

  /**
   * Get general stats
   */
  static async getHelpStats() {
    try {
      const stats = await Help.aggregate([
        { $match: { isActive: true } },
        { 
          $group: {
            _id: null,
            totalArticles: { $sum: 1 },
            totalViews: { $sum: "$views" },
            totalHelpful: { $sum: "$helpful" },
            totalNotHelpful: { $sum: "$notHelpful" }
          }
        }
      ]);

      const data = stats[0] || { totalArticles: 0, totalViews: 0, totalHelpful: 0, totalNotHelpful: 0 };
      const totalVotes = data.totalHelpful + data.totalNotHelpful;
      
      return {
        ...data,
        helpfulRate: totalVotes > 0 ? ((data.totalHelpful / totalVotes) * 100).toFixed(2) : 0,
        avgViewsPerArticle: data.totalArticles > 0 ? Math.round(data.totalViews / data.totalArticles) : 0
      };
    } catch (error) {
      logger.error('Get help stats error', error);
      throw error;
    }
  }
}

export default HelpService;