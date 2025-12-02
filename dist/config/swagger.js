"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = __importDefault(require("./env"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Worldpedia Education API',
            version: '1.0.0',
            description: 'Dokumentasi API untuk Platform Bimbel Worldpedia Education',
            contact: {
                name: 'Worldpedia Team',
                email: 'worldpediaeducation12345@gmail.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${env_1.default.port}/api`,
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Pattern untuk mencari anotasi swagger di file routes dan models
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map