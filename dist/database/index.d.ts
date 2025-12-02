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
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import mongoose, { Connection } from 'mongoose';
/**
 * Connect to MongoDB Database
 */
export declare const connectDB: (mongoUri: string) => Promise<Connection>;
/**
 * Disconnect from MongoDB Database
 */
export declare const disconnectDB: () => Promise<void>;
/**
 * Get database connection
 */
export declare const getDB: () => Connection | null;
/**
 * Check if database is connected
 */
export declare const isDBConnected: () => boolean;
declare const _default: {
    connectDB: (mongoUri: string) => Promise<mongoose.Connection>;
    disconnectDB: () => Promise<void>;
    getDB: () => mongoose.Connection | null;
    isDBConnected: () => boolean;
};
export default _default;
//# sourceMappingURL=index.d.ts.map