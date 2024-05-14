/** @format */

import { Bucket } from '@google-cloud/storage';

declare module 'fastify' {
  interface FastifyInstance {
    storage: Bucket;
    storagePlugin: {
      getDownloadURL: (imageUrl: string) => Promise<string>;
    };
  }
}

export {};
