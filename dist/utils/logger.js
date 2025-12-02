"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Log levels
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Logger class
 */
class Logger {
    constructor() {
        this.logDir = path_1.default.join(process.cwd(), 'logs');
        this.isFileLoggingEnabled = true; // Flag untuk status file logging
        this.ensureLogDirectory();
    }
    /**
     * Ensure log directory exists
     * Modified to handle Read-Only environments (like Vercel) gracefully
     */
    ensureLogDirectory() {
        try {
            if (!fs_1.default.existsSync(this.logDir)) {
                fs_1.default.mkdirSync(this.logDir, { recursive: true });
            }
        }
        catch (error) {
            // Jika gagal membuat folder (misal di Vercel), matikan fitur log ke file
            console.warn('⚠️ Logger: Cannot create logs directory (Read-only filesystem detected). File logging disabled.');
            this.isFileLoggingEnabled = false;
        }
    }
    /**
     * Format log message
     */
    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
        return `[${timestamp}] [${level}] ${message}${dataStr}`;
    }
    /**
     * Write to console and file
     */
    write(level, message, data) {
        const formattedMessage = this.formatMessage(level, message, data);
        // 1. Console output (Selalu jalan, ini yang akan muncul di Vercel Logs)
        const consoleMethod = this.getConsoleMethod(level);
        consoleMethod(formattedMessage);
        // 2. File output (Hanya jika diizinkan / tidak error saat init)
        if (this.isFileLoggingEnabled && (process.env.NODE_ENV === 'production' || level === LogLevel.ERROR)) {
            this.writeToFile(level, formattedMessage);
        }
    }
    /**
     * Get appropriate console method
     */
    getConsoleMethod(level) {
        switch (level) {
            case LogLevel.DEBUG:
                return console.debug;
            case LogLevel.INFO:
                return console.info;
            case LogLevel.WARN:
                return console.warn;
            case LogLevel.ERROR:
                return console.error;
            default:
                return console.log;
        }
    }
    /**
     * Write log to file
     */
    writeToFile(level, message) {
        if (!this.isFileLoggingEnabled)
            return; // Double check
        try {
            const date = new Date().toISOString().split('T')[0];
            const filename = path_1.default.join(this.logDir, `${level.toLowerCase()}-${date}.log`);
            fs_1.default.appendFileSync(filename, message + '\n');
        }
        catch (error) {
            // Silent fail jika tiba-tiba tidak bisa nulis, alihkan ke console error
            console.error('Failed to write log file:', error);
        }
    }
    /**
     * Debug log
     */
    debug(message, data) {
        this.write(LogLevel.DEBUG, message, data);
    }
    /**
     * Info log
     */
    info(message, data) {
        this.write(LogLevel.INFO, message, data);
    }
    /**
     * Warn log
     */
    warn(message, data) {
        this.write(LogLevel.WARN, message, data);
    }
    /**
     * Error log
     */
    error(message, error) {
        const errorData = error instanceof Error
            ? {
                name: error.name,
                errorMessage: error.message,
                stack: error.stack
            }
            : error;
        this.write(LogLevel.ERROR, message, errorData);
    }
    /**
     * Log API request
     */
    logRequest(method, path, statusCode) {
        const msg = `${method} ${path}${statusCode ? ` - ${statusCode}` : ''}`;
        this.info(msg);
    }
    /**
     * Log authentication event
     */
    logAuth(action, userId, success, details) {
        const message = `Auth: ${action} for user ${userId} - ${success ? 'SUCCESS' : 'FAILED'}`;
        this.info(message, details);
    }
    /**
     * Log database operation
     */
    logDatabase(operation, collection, details) {
        const message = `Database: ${operation} on ${collection}`;
        this.debug(message, details);
    }
    /**
     * Log payment operation
     */
    logPayment(action, amount, status, details) {
        const message = `Payment: ${action} - Amount: ${amount}, Status: ${status}`;
        this.info(message, details);
    }
    /**
     * Log email operation
     */
    logEmail(recipient, subject, success) {
        const message = `Email: Sent to ${recipient} - Subject: ${subject} - ${success ? 'SUCCESS' : 'FAILED'}`;
        this.info(message);
    }
}
exports.Logger = Logger;
/**
 * Create logger instance
 */
exports.logger = new Logger();
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map