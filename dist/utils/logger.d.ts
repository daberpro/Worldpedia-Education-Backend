/**
 * Log levels
 */
export declare enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}
/**
 * Logger class
 */
export declare class Logger {
    private logDir;
    private isFileLoggingEnabled;
    constructor();
    /**
     * Ensure log directory exists
     * Modified to handle Read-Only environments (like Vercel) gracefully
     */
    private ensureLogDirectory;
    /**
     * Format log message
     */
    private formatMessage;
    /**
     * Write to console and file
     */
    private write;
    /**
     * Get appropriate console method
     */
    private getConsoleMethod;
    /**
     * Write log to file
     */
    private writeToFile;
    /**
     * Debug log
     */
    debug(message: string, data?: any): void;
    /**
     * Info log
     */
    info(message: string, data?: any): void;
    /**
     * Warn log
     */
    warn(message: string, data?: any): void;
    /**
     * Error log
     */
    error(message: string, error?: Error | any): void;
    /**
     * Log API request
     */
    logRequest(method: string, path: string, statusCode?: number): void;
    /**
     * Log authentication event
     */
    logAuth(action: string, userId: string, success: boolean, details?: any): void;
    /**
     * Log database operation
     */
    logDatabase(operation: string, collection: string, details?: any): void;
    /**
     * Log payment operation
     */
    logPayment(action: string, amount: number, status: string, details?: any): void;
    /**
     * Log email operation
     */
    logEmail(recipient: string, subject: string, success: boolean): void;
}
/**
 * Create logger instance
 */
export declare const logger: Logger;
export default logger;
//# sourceMappingURL=logger.d.ts.map