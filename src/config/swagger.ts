import swaggerJsdoc from 'swagger-jsdoc';
import config from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Worldpedia Education API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk Platform Bimbel Worldpedia Education',
      contact: {
        name: 'Worldpedia Team',
        email: 'admin@worldpedia.com', // Sesuaikan email
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Development Server',
      },
      {
        url: 'https://api.worldpedia.com/api', // Sesuaikan domain production nanti
        description: 'Production Server',
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

export const swaggerSpec = swaggerJsdoc(options);