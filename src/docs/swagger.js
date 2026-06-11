const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AprenTIC Campus API',
            version: '1.0.0',
            description: 'API REST para la gestión académica del bootcamp AprenTIC'
        },
        servers: [{ url: '/' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Usuario: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'admin@aprentic.com' },
                        password: { type: 'string', example: '123456' },
                        rol: { type: 'string', enum: ['admin', 'profesor'], example: 'admin' }
                    }
                },
                Alumno: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', example: 'Ana García López' },
                        email: { type: 'string', example: 'ana.garcia@email.com' },
                        promocion: { type: 'string', example: '64abc123def456' }
                    }
                },
                Profesor: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', example: 'Carlos Martínez' },
                        email: { type: 'string', example: 'carlos.martinez@aprentic.com' }
                    }
                },
                Promocion: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', example: 'Fullstack 2024-1' },
                        fechaInicio: { type: 'string', format: 'date', example: '2024-01-15' },
                        fechaFin: { type: 'string', format: 'date', example: '2024-06-15' },
                        campus: { type: 'string', example: '64abc123def456' }
                    }
                },
                Proyecto: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', example: 'Proyecto E-commerce' },
                        promocion: { type: 'string', example: '64abc123def456' }
                    }
                },
                Nota: {
                    type: 'object',
                    properties: {
                        alumno: { type: 'string', example: '64abc123def456' },
                        nota: { type: 'number', example: 8.5 },
                        estado: { type: 'string', enum: ['Apto', 'No Apto'], example: 'Apto' },
                        profesor: { type: 'string', example: '64abc123def456' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Mensaje de error' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };