/** @format */

import fp from 'fastify-plugin';
import sharp from 'sharp';
import type { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';

const sharpPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('sharp', (buffer: Buffer) => sharp(buffer));

  fastifyInstance.decorate('sharpPlugin', {
    getValidationFileSize: (reply: FastifyReply, size: number): FastifyReply | null => {
      const sizeMax: number = 1048576 * 3;

      if (size >= sizeMax) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Maximum file size exceeded',
          statusCode: 400
        });
      }

      return null;
    },
    getValidationMimeType: (reply: FastifyReply, mimeType: string): FastifyReply | null => {
      const mimeTypeList: string[] = ['image/png'];

      if (!mimeTypeList.includes(mimeType)) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Invalid MIME type',
          statusCode: 400
        });
      }

      return null;
    }
  });
});

export default sharpPlugin;
