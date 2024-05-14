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
          input: {
            type: 'string',
            default: 'https://firebasestorage.googleapis.com/v0/b/takabase-local.appspot.com/o/seed/1.webp?alt=media'
          }
        },
        required: ['input'],
        additionalProperties: false
      },
      response: {
        400: {
          $ref: 'responseErrorSchema#'
        },
        500: {
          $ref: 'responseErrorSchema#'
        }
      }
    },
    handler: async (request: FastifyRequest<OutputDownloadUrlDto>, reply: FastifyReply): Promise<any> => {
      const { input }: Record<string, any> = request.query;

      /** Firebase Storage */

      await request.server.storagePlugin
        .getDownloadURL(input)
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
