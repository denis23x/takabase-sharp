/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import sharp from 'sharp';

const sharpPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('sharp', {
    getSharp: (buffer: Buffer) => sharp(buffer),
    getFileSizeValidation: (reply: FastifyReply, size: number): FastifyReply | null => {
      const sizeMax: number = 1048576 * 5;

      if (size >= sizeMax) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Maximum file size exceeded',
          statusCode: 400
        });
      }

      return null;
    },
    getMimeTypeValidation: (reply: FastifyReply, mimeType: string): FastifyReply | null => {
      const mimeTypeList: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

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
