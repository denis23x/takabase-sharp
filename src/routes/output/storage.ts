/** @format */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ParamsUid } from '../../types/crud/params/params-uid';
import type { DownloadResponse } from '@google-cloud/storage/build/cjs/src/file';
import type { OutputStorageDto } from '../../types/dto/output/storage';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'GET',
    url: 'storage/:path/:uid',
    schema: {
      tags: ['Output'],
      description: 'Get images by short url',
      params: {
        type: 'object',
        properties: {
          path: {
            $ref: 'partsStorageSchema#'
          },
          uid: {
            $ref: 'partsNanoUidSchema#'
          }
        }
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
    handler: async (request: FastifyRequest<ParamsUid & OutputStorageDto>, reply: FastifyReply): Promise<any> => {
      await request.server.storageBucket
        .file([request.params.path, request.params.uid].join('/'))
        .download()
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
