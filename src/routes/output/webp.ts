/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { OutputWebPDto } from '../../types/dto/output/webp';
import { Sharp } from 'sharp';
import { parse, ParsedPath } from 'path';
import Busboy from 'busboy';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: 'webp',
    schema: {
      tags: ['Output'],
      description: 'Get WebP output of image',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          quality: {
            type: 'number',
            default: 80
          },
          lossless: {
            type: 'boolean',
            default: false
          },
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
          type: 'array'
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
    preValidation: (request: FastifyRequest<OutputWebPDto>, reply: FastifyReply, done: HookHandlerDoneFunction): void => {
      // Swagger pass validation

      request.body = {
        input: 'input'
      };

      done();
    },
    handler: async (request: FastifyRequest<OutputWebPDto>, reply: FastifyReply): Promise<any> => {
      const busboy: Busboy.Busboy = Busboy({
        headers: request.headers
      });

      /** Busboy */

      const formFields: Record<string, any> = {};

      busboy.on('field', (fieldName: string, value: any): void => {
        formFields[fieldName] = ((): any => {
          switch (fieldName) {
            case 'quality': {
              return Number(value);
            }
            case 'lossless': {
              return String(value) === 'true';
            }
            default: {
              return value;
            }
          }
        })();
      });

      const formFiles: Record<string, any> = {};

      busboy.on('file', (fieldName: string, file: any, fileInfo: Busboy.FileInfo): void => {
        const parsedPath: ParsedPath = parse(fileInfo.filename);

        formFiles[fieldName] = {
          mimeType: fileInfo.mimeType,
          file: null,
          name: parsedPath.name,
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
              request.server.sharpPlugin.getValidationFileSize(reply, formFiles.input.size),
              request.server.sharpPlugin.getValidationMimeType(reply, formFiles.input.mimeType)
            ].filter((validation: FastifyReply | null) => validation !== null);
          };

          const validation: FastifyReply[] = validationPayload();

          /** Throw out the first (any) error */

          if (validation.length) {
            return validation[0];
          }

          const sharp: Sharp = request.server.sharp(formFiles.input.file);

          await sharp
            .webp(formFields)
            .toBuffer()
            .then((buffer: Buffer) => {
              return reply
                .header('Content-Disposition', 'attachment; filename=' + formFiles.input.name + '.webp')
                .type('image/webp')
                .status(200)
                .send(buffer);
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
