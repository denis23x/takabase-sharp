/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { FetchDto } from '../types/dto/fetch';
import { parse, ParsedPath } from 'path';
import axios, { AxiosResponse } from 'axios';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'GET',
    url: 'fetch',
    schema: {
      tags: ['Sharp'],
      description: 'Get buffer from url',
      querystring: {
        type: 'object',
        properties: {
          // prettier-ignore
          url: {
            type: 'string',
            default: 'https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg',
            pattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$'
          }
        },
        required: ['url'],
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
    handler: async (request: FastifyRequest<FetchDto>, reply: FastifyReply): Promise<any> => {
      const { url }: Record<string, string> = request.query;

      const parsedURL: URL = new URL(url);
      const parsedPath: ParsedPath = parse(parsedURL.pathname);

      await axios
        .get(url, {
          responseType: 'arraybuffer'
        })
        .then((axiosResponse: AxiosResponse) => {
          const buffer: Buffer = axiosResponse.data;
          const getMimeType = (arrayBuffer: ArrayBuffer): string | null => {
            const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
            const uint8ArrayLength: number = 4;

            if (uint8Array.length >= uint8ArrayLength) {
              const signatureArray: any[] = new Array(uint8ArrayLength);

              for (let i: number = 0; i < uint8ArrayLength; i++) {
                signatureArray[i] = new Uint8Array(arrayBuffer)[i].toString(16).padStart(2, '0');
              }

              const signature: string = signatureArray.join('').toUpperCase();

              /** https://gist.github.com/Qti3e/6341245314bf3513abb080677cd1c93b */

              switch (signature) {
                case '89504E47':
                  return 'image/png';
                case '47494638':
                  return 'image/gif';
                case 'FFD8FFDB':
                case 'FFD8FFE0':
                  return 'image/jpeg';
                case '52494646':
                  return 'image/webp';
                default:
                  return null;
              }
            }

            return null;
          };

          const mimeType: string | null = getMimeType(buffer);

          if (mimeType) {
            return reply
              .header('Content-Disposition', 'attachment; filename=' + parsedPath.base)
              .type(mimeType)
              .status(200)
              .send(buffer);
          } else {
            return reply.status(400).send({
              error: 'Bad Request',
              message: 'The file returned from url does not seem to be a valid image type',
              statusCode: 400
            });
          }
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
