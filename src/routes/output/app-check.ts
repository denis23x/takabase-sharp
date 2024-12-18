/** @format */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { OutputAppCheckDto } from '../../types/dto/output/app-check';
import type { DownloadResponse } from '@google-cloud/storage/build/cjs/src/file';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'GET',
    url: 'app-check',
    schema: {
      tags: ['Output'],
      description: 'Get image file of Firebase Storage',
      querystring: {
        type: 'object',
        properties: {
          url: {
            $ref: 'partsFirebaseUrlStorageSchema#'
          }
        },
        required: ['url']
      },
      response: {
        '200': {
          type: 'array'
        },
        '4xx': {
          $ref: 'responseErrorSchema#'
        },
        '5xx': {
          $ref: 'responseErrorSchema#'
        }
      }
    },
    handler: async (request: FastifyRequest<OutputAppCheckDto>, reply: FastifyReply): Promise<any> => {
      const { url }: Record<string, any> = request.query;

      /** Firebase Storage */

      await request.server.storagePlugin
        .getFile(url)
        .then((downloadResponse: DownloadResponse) => {
          return reply
            .header('Content-Disposition', 'inline')
            .type('image/webp')
            .status(200)
            .send(downloadResponse.pop());
        })
        .catch((error: any) => {
          return reply.status(500).send({
            error: 'Internal Server Error',
            message: error.message,
            statusCode: 500
          });
        });
    }
  });
}
