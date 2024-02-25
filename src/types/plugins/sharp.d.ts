/** @format */

import { Sharp } from 'sharp';

declare module 'fastify' {
  interface FastifyInstance {
    sharp: {
      getSharp: (buffer: Buffer) => Sharp;
      getMimeType: (arrayBuffer: ArrayBuffer) => string | null;
      getValidationFileSize: (reply: FastifyReply, size: number) => FastifyReply | null;
      getValidationMimeType: (reply: FastifyReply, mimeType: string) => FastifyReply | null;
    };
  }
}

export {};
