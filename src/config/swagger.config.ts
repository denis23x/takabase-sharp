/** @format */

import { SwaggerOptions } from '@fastify/swagger';

export const swaggerConfig: SwaggerOptions = {
  openapi: {
    info: {
      title: 'APIs using Fastify',
      description: '## Moderation using Swagger, Fastify and Sharp',
      contact: {
        name: 'denis23x',
        url: 'https://takabase.com',
        email: 'damage.23x@gmail.com'
      },
      version: '1.0.0'
    },
    tags: [
      {
        name: 'Sharp',
        description: 'Node.js image processing'
      },
      {
        name: 'Output',
        description: 'Get output'
      }
    ]
  }
};
