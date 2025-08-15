import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Screening Agent API',
      version: '1.0.0',
      description: 'API documentation for the AI Screening Agent server',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The user ID',
              example: '60d0fe4f5311236168a109ca'
            },
            displayName: {
              type: 'string',
              description: 'The display name of the user',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              description: 'The email of the user',
              example: 'john.doe@example.com'
            },
            isVerified: {
              type: 'boolean',
              description: 'Whether the user email is verified',
              example: true
            },
          }
        },
        Testimonial: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The testimonial ID',
              example: '60d0fe4f5311236168a109cb'
            },
            author: {
              type: 'string',
              description: 'The author of the testimonial',
              example: 'Jane Doe'
            },
            content: {
              type: 'string',
              description: 'The content of the testimonial',
              example: 'This is a great product!'
            },
            approved: {
              type: 'boolean',
              description: 'Whether the testimonial is approved',
              example: true
            },
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
