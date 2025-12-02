/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
export declare class HelpService {
    static processUserQuery(input: string): Promise<{
        status: string;
        data: {
            question: string;
            answer: string;
            category: string;
            relevance: string;
        };
    }>;
    static createHelpArticle(helpData: any, createdBy: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IHelp, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IHelp & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static getHelpArticleById(helpId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IHelp, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IHelp & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static updateHelpArticle(helpId: string, updateData: any, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../models").IHelp, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IHelp & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static deleteHelpArticle(helpId: string, userId: string): Promise<{
        message: string;
    }>;
    static searchByKeywords(query: string, page: number, limit: number): Promise<{
        articles: (import("mongoose").Document<unknown, {}, import("../models").IHelp, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IHelp & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    static getByCategory(category: string, page: number, limit: number): Promise<{
        articles: (import("mongoose").Document<unknown, {}, import("../models").IHelp, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IHelp & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    static markAsHelpful(helpId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models").IHelp, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IHelp & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    static markAsNotHelpful(helpId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models").IHelp, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IHelp & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    static getCategories(): Promise<any[]>;
    static getHelpStats(): Promise<any>;
}
export default HelpService;
//# sourceMappingURL=help.service.d.ts.map