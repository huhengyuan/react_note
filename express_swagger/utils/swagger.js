const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger API',
      version: '1.0.0',
      description: 'Swagger Test API',
      contact: {
        name: 'hhy',
        email: 'hhydeyx@qq.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:9752', // Replace with your API server URL
      },
    ],
  },
  apis: ['../routes/*.js'], // Replace with the path to your Express routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
