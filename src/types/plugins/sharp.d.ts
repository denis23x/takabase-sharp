/** @format */

import { Sharp } from 'sharp';

declare module 'fastify' {
  interface FastifyInstance {
    sharp: {
      getSharp: (buffer: Buffer) => Sharp;
      getFileSizeValidation: (reply: FastifyReply, size: number) => FastifyReply | null;
      getMimeTypeValidation: (reply: FastifyReply, mimeType: string) => FastifyReply | null;
    };
  }
}

export {};
