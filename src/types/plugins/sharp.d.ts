/** @format */

import { Sharp } from 'sharp';

declare module 'fastify' {
  interface FastifyInstance {
    sharp: (buffer: Buffer) => Sharp;
    sharpPlugin: {
      getValidationFileSize: (reply: FastifyReply, size: number) => FastifyReply | null;
      getValidationMimeType: (reply: FastifyReply, mimeType: string) => FastifyReply | null;
    };
  }
}

export {};
