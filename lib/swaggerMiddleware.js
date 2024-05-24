const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PsychoHub API',
    version: '1.0.0',
    description: 'Documentación de la API de PsychoHub',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    schemas: {
      Ad: {
        type: 'object',
        properties: {
          nombre: {
            type: 'string',
          },
          venta: {
            type: 'boolean',
          },
          precio: {
            type: 'number',
          },
          foto: {
            type: 'string',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          msg: {
            type: 'string',
          },
          param: {
            type: 'string',
          },
          location: {
            type: 'string',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../src/routes/*.js'), path.join(__dirname, '../src/controller/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
