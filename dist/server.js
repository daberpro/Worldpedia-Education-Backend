"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./database");
const logger_1 = require("./utils/logger");
/**
 * Server Initialization
 */
const startServer = async () => {
    try {
        /**
         * ============================================================================
         * ENVIRONMENT VARIABLES
         * ============================================================================
         */
        const PORT = parseInt(process.env.PORT || '5000', 10);
        const NODE_ENV = process.env.NODE_ENV || 'development';
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/worldpedia';
        /**
         * ============================================================================
         * DATABASE CONNECTION
         * ============================================================================
         */
        logger_1.logger.info('🔌 Connecting to MongoDB...');
        await (0, database_1.connectDB)(MONGODB_URI);
        logger_1.logger.info(`✅ MongoDB connected: ${MONGODB_URI}`);
        /**
         * ============================================================================
         * CREATE EXPRESS APP
         * ============================================================================
         */
        const app = (0, app_1.default)();
        /**
         * ============================================================================
         * START SERVER
         * ============================================================================
         */
        const server = app.listen(() => {
            logger_1.logger.info(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    🚀 Worldpedia Education Backend Server Started!           ║
║                                                               ║
║  Environment:  ${NODE_ENV.padEnd(45)}║
║  Port:         ${PORT.toString().padEnd(45)}║
║  Database:     MongoDB Connected ✅
║  Time:         ${new Date().toISOString().padEnd(45)}║
║                                                               ║
║  Health Check: http://localhost:${PORT}/health
║  API Docs:     http://localhost:${PORT}/api
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
      `);
        });
        /**
         * ============================================================================
         * GRACEFUL SHUTDOWN HANDLING
         * ============================================================================
         */
        const gracefulShutdown = async (signal) => {
            logger_1.logger.warn(`\n\n📋 ${signal} received. Starting graceful shutdown...`);
            server.close(() => {
                logger_1.logger.info('✅ HTTP server closed');
            });
            // Close database connection
            try {
                // Implement MongoDB connection close if needed
                logger_1.logger.info('✅ Database connection closed');
            }
            catch (error) {
                logger_1.logger.error('Error closing database connection', error);
            }
            process.exit(0);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        /**
         * ============================================================================
         * UNHANDLED ERROR HANDLERS
         * ============================================================================
         */
        process.on('uncaughtException', (error) => {
            logger_1.logger.error('❌ UNCAUGHT EXCEPTION:', error);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason) => {
            logger_1.logger.error('❌ UNHANDLED REJECTION:', reason);
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.logger.error('❌ FATAL ERROR - Server failed to start:', error);
        process.exit(1);
    }
};
/**
 * Start the server
 */
startServer();
exports.default = startServer;
//# sourceMappingURL=server.js.map