"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDBConnected = exports.getDB = exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
/**
 * Global database connection reference
 */
let dbConnection = null;
/**
 * Connect to MongoDB Database
 */
const connectDB = async (mongoUri) => {
    try {
        // Check if already connected
        if (mongoose_1.default.connection.readyState === 1) {
            logger_1.logger.info('📦 Already connected to MongoDB');
            return mongoose_1.default.connection;
        }
        // Connect to MongoDB
        await mongoose_1.default.connect(mongoUri, {
            maxPoolSize: 10,
            socketTimeoutMS: 45000
        });
        dbConnection = mongoose_1.default.connection;
        // Setup connection event listeners
        mongoose_1.default.connection.on('connected', () => {
            logger_1.logger.info('✅ MongoDB connection established');
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('⚠️  MongoDB disconnected');
        });
        mongoose_1.default.connection.on('error', (error) => {
            logger_1.logger.error('❌ MongoDB connection error:', error);
        });
        return dbConnection;
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to connect to MongoDB:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
/**
 * Disconnect from MongoDB Database
 */
const disconnectDB = async () => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            await mongoose_1.default.disconnect();
            logger_1.logger.info('✅ Disconnected from MongoDB');
        }
    }
    catch (error) {
        logger_1.logger.error('❌ Error disconnecting from MongoDB:', error);
        throw error;
    }
};
exports.disconnectDB = disconnectDB;
/**
 * Get database connection
 */
const getDB = () => {
    return dbConnection || mongoose_1.default.connection;
};
exports.getDB = getDB;
/**
 * Check if database is connected
 */
const isDBConnected = () => {
    return mongoose_1.default.connection.readyState === 1;
};
exports.isDBConnected = isDBConnected;
exports.default = {
    connectDB: exports.connectDB,
    disconnectDB: exports.disconnectDB,
    getDB: exports.getDB,
    isDBConnected: exports.isDBConnected
};
//# sourceMappingURL=index.js.map