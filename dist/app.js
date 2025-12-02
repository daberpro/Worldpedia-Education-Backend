"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
// Routes
const routes_1 = require("./routes");
// Middleware
const middleware_1 = require("./middleware");
// Utils
const logger_1 = require("./utils/logger");
/**
 * Express Application Factory
 */
const createApp = () => {
    const app = express_1.default.Router();
    /**
     * SECURITY & CONFIGURATION
     */
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:']
            }
        }
    }));
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
    app.use(middleware_1.requestLogger);
    app.use(middleware_1.requestValidator);
    /**
     * SWAGGER DOCUMENTATION
     */
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swagger_1.swaggerSpec);
    });
    logger_1.logger.info('✅ Swagger docs mounted on /api-docs');
    /**
     * HEALTH CHECK
     */
    app.get('/health', (_req, res) => {
        res.status(200).json({
            success: true,
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    });
    app.get('/api', (_req, res) => {
        res.status(200).json({
            success: true,
            message: 'Worldpedia Education Backend API',
            version: '1.0.0',
            docs: '/api-docs'
        });
    });
    /**
     * ROUTES MOUNTING
     */
    app.use('/api/auth', routes_1.authRoutes);
    app.use('/api/oauth', routes_1.oauthRoutes);
    app.use('/api/courses', routes_1.courseRoutes);
    app.use('/api/enrollments', routes_1.enrollmentRoutes);
    app.use('/api/payments', routes_1.paymentRoutes);
    app.use('/api/certificates', routes_1.certificateRoutes);
    app.use('/api/forms', routes_1.formRoutes);
    app.use('/api/help', routes_1.helpRoutes);
    app.use('/api/analytics', routes_1.analyticsRoutes);
    app.use('/api/users', routes_1.userRoutes);
    app.use('/api/email', routes_1.emailRoutes);
    app.use('/api/upload', routes_1.uploadRoutes);
    /**
     * ERROR HANDLING
     */
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            error: 'Endpoint not found',
            path: _req.path,
            method: _req.method
        });
    });
    app.use(middleware_1.globalErrorHandler);
    return app;
};
exports.createApp = createApp;
exports.default = exports.createApp;
//# sourceMappingURL=app.js.map