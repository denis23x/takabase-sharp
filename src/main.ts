/** @format */

import fastify, { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';
import { ContentTypeParserDoneFunction } from 'fastify/types/content-type-parser';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import fastifyEtag from '@fastify/etag';

// CONFIGURATIONS

import { corsConfig } from './config/cors.config';
import { loggerConfig } from './config/logger.config';
import { compressConfig } from './config/compress.config';
import { helmetConfig } from './config/helmet.config';
import { swaggerConfig } from './config/swagger.config';
import { rateLimitConfig } from './config/rate-limit.config';
import { staticConfig } from './config/static.config';

// PLUGINS

import authPlugin from './plugins/auth.plugin';
import firebasePlugin from './plugins/firebase.plugin';
import firestorePlugin from './plugins/firestore.plugin';
import sharpPlugin from './plugins/sharp.plugin';
import storagePlugin from './plugins/storage.plugin';

// ROUTES

import outputRoutes from './routes/output';
import utilitiesRoutes from './routes/utilities';

// SCHEMAS

import { responseErrorSchema } from './schema/crud/response/response-error.schema';
import { partsFirebaseUrlStorageSchema } from './schema/parts/parts-firebase-url-storage.schema';
import { partsUrlSchema } from './schema/parts/parts-url.schema';

export const main = async (): Promise<FastifyInstance> => {
  const fastifyInstance: FastifyInstance = fastify({
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    ajv: {
      customOptions: {
        keywords: ['example']
      }
    },
    logger: loggerConfig
  });

  // PLUGINS

  await fastifyInstance.register(fastifyCors, corsConfig);
  await fastifyInstance.register(fastifyCompress, compressConfig);
  await fastifyInstance.register(fastifyHelmet, helmetConfig);
  await fastifyInstance.register(fastifyRateLimit, rateLimitConfig);
  await fastifyInstance.register(fastifyStatic, staticConfig);
  await fastifyInstance.register(fastifyEtag);

  // INDEX

  fastifyInstance.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).type('text/html').sendFile('index.html');
  });

  // FIREBASE

  fastifyInstance.register(firebasePlugin).after(async () => {
    await fastifyInstance.register(authPlugin);
    await fastifyInstance.register(firestorePlugin);
    await fastifyInstance.register(storagePlugin);
  });

  // PLUGINS HANDMADE

  await fastifyInstance.register(sharpPlugin);

  // JSON SCHEMA CRUD

  fastifyInstance.addSchema(responseErrorSchema);
  fastifyInstance.addSchema(partsFirebaseUrlStorageSchema);
  fastifyInstance.addSchema(partsUrlSchema);

  // LOCALHOST

  if (process.env.APP_NODE_ENV === 'localhost') {
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
      api.register(outputRoutes, {
        prefix: '/output/'
      });
      api.register(utilitiesRoutes, {
        prefix: '/utilities/'
      });
    },
    {
      prefix: '/api/v1'
    }
  );

  return fastifyInstance;
};
