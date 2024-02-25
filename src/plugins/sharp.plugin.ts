/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import sharp from 'sharp';

const sharpPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('sharp', {
    getSharp: (buffer: Buffer) => sharp(buffer),
    getMimeType: (arrayBuffer: ArrayBuffer): string | null => {
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
    },
    getValidationFileSize: (reply: FastifyReply, size: number): FastifyReply | null => {
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
    getValidationMimeType: (reply: FastifyReply, mimeType: string): FastifyReply | null => {
      const mimeTypeList: string[] = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

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
