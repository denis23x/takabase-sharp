/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { OutputDownloadUrlDto } from '../../types/dto/output/download-url';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'GET',
    url: 'download-url',
    schema: {
      tags: ['Output'],
      description: 'Get image downloadable url of Firebase Storage',
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
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                downloadURL: {
                  type: 'string'
                }
              }
            },
            statusCode: {
              type: 'number'
            }
          }
        },
        '4xx': {
          $ref: 'responseErrorSchema#'
        },
        '5xx': {
          $ref: 'responseErrorSchema#'
        }
      }
    },
    handler: async (request: FastifyRequest<OutputDownloadUrlDto>, reply: FastifyReply): Promise<any> => {
      const { url }: Record<string, any> = request.query;

      /** Firebase Storage */

      await request.server.storagePlugin
        .getDownloadURL(url)
        .then((downloadURL: string) => {
          return reply.status(200).send({
            data: {
              downloadURL
            },
            statusCode: 200
          });
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
