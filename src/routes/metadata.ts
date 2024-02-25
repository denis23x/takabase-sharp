/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { MetadataDto } from '../types/dto/metadata';
import { Metadata, Sharp } from 'sharp';
import Busboy from 'busboy';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: 'metadata',
    schema: {
      tags: ['Sharp'],
      description: 'Get metadata of image',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            contentMediaType: 'image/png',
            contentEncoding: 'binary'
          }
        },
        required: ['input'],
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              $ref: 'metadataSchema#'
            },
            statusCode: {
              type: 'number'
            }
          }
        },
        400: {
          $ref: 'responseErrorSchema#'
        },
        500: {
          $ref: 'responseErrorSchema#'
        }
      }
    },
    // prettier-ignore
    preValidation: (request: FastifyRequest<MetadataDto>, reply: FastifyReply, done: HookHandlerDoneFunction): void => {
      // Swagger pass validation

      request.body = {
        input: 'input'
      };

      done();
    },
    handler: async (request: FastifyRequest<MetadataDto>, reply: FastifyReply): Promise<any> => {
      const busboy: Busboy.Busboy = Busboy({
        headers: request.headers
      });

      /** Busboy */

      const formFiles: Record<string, any> = {};

      busboy.on('file', (fieldName: string, file: any, fileInfo: Busboy.FileInfo): void => {
        formFiles[fieldName] = {
          mimeType: fileInfo.mimeType,
          file: null,
          size: 0
        };

        // prettier-ignore
        file.on('data', (chunk: any[]): void => {
          formFiles[fieldName].file = formFiles[fieldName].file === null ? chunk : Buffer.concat([formFiles[fieldName].file, chunk]);
          formFiles[fieldName].size = formFiles[fieldName].size + chunk.length;
        });
      });

      /** Sharp */

      await new Promise((): void => {
        busboy.on('finish', async (): Promise<void> => {
          const validationPayload = (): any[] => {
            return [
              request.server.sharp.getValidationFileSize(reply, formFiles.input.size),
              request.server.sharp.getValidationMimeType(reply, formFiles.input.mimeType)
            ].filter((validation: FastifyReply | null) => validation !== null);
          };

          const validation: FastifyReply[] = validationPayload();

          /** Throw out the first (any) error */

          if (validation.length) {
            return validation[0];
          }

          const sharp: Sharp = request.server.sharp.getSharp(formFiles.input.file);

          await sharp
            .metadata()
            .then((metadata: Metadata) => {
              return reply.status(200).send({
                data: metadata,
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
        });

        // @ts-ignore
        busboy.end(request.raw.body);
      });
    }
  });
}
