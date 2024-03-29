/** @format */

import fastify, { FastifyRequest } from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyRateLimit from '@fastify/rate-limit';

import { envConfig } from './config/env.config';
import { corsConfig } from './config/cors.config';
import { loggerConfig } from './config/logger.config';
import { compressConfig } from './config/compress.config';
import { helmetConfig } from './config/helmet.config';
import { swaggerConfig } from './config/swagger.config';
import { rateLimitConfig } from './config/rate-limit.config';

import sharpPlugin from './plugins/sharp.plugin';

import sharpRoutes from './routes';
import sharpOutputRoutes from './routes/output';

import { responseErrorSchema } from './schema/crud/response/response-error.schema';

import { metadataSchema } from './schema/metadata.schema';

import { FastifyInstance } from 'fastify/types/instance';
import { ContentTypeParserDoneFunction } from 'fastify/types/content-type-parser';

export const main = async (): Promise<FastifyInstance> => {
  const fastifyInstance: FastifyInstance = fastify({
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    logger: loggerConfig
  });

  // PLUGINS

  await fastifyInstance.register(fastifyEnv, envConfig);
  await fastifyInstance.register(fastifyCors, corsConfig);
  await fastifyInstance.register(fastifyCompress, compressConfig);
  await fastifyInstance.register(fastifyHelmet, helmetConfig);
  await fastifyInstance.register(fastifyRateLimit, rateLimitConfig);

  await fastifyInstance.register(sharpPlugin);

  // JSON SCHEMA CRUD

  fastifyInstance.addSchema(responseErrorSchema);

  // JSON SCHEMA MODELS

  fastifyInstance.addSchema(metadataSchema);

  // LOCALHOST

  if (fastifyInstance.config.NODE_ENV === 'localhost') {
    await fastifyInstance.register(fastifySwagger, swaggerConfig);
    await fastifyInstance.register(fastifySwaggerUi, {
      routePrefix: '/docs'
    });
  }

  // GCP ISSUE

  fastifyInstance.removeAllContentTypeParsers();

  // prettier-ignore
  fastifyInstance.addContentTypeParser('application/json', (request: FastifyRequest, body: any, done: ContentTypeParserDoneFunction): void => {
    done(null, body.body);
  });

  // prettier-ignore
  fastifyInstance.addContentTypeParser('multipart/form-data', (request: FastifyRequest, payload: any, done: ContentTypeParserDoneFunction): void => {
    done(null);
  });

  // API

  await fastifyInstance.register(
    async (api: FastifyInstance): Promise<void> => {
      api.register(sharpRoutes, {
        prefix: '/'
      });
      api.register(sharpOutputRoutes, {
        prefix: '/output/'
      });
    },
    {
      prefix: '/api/v1'
    }
  );

  return fastifyInstance;
};
