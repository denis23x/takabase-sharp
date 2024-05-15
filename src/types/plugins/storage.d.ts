/** @format */

import { Bucket, DownloadResponse } from '@google-cloud/storage';

declare module 'fastify' {
  interface FastifyInstance {
    storage: Bucket;
    storagePlugin: {
      getDownloadURL: (imageUrl: string) => Promise<string>;
      getFile: (imageUrl: string) => Promise<DownloadResponse>;
    };
  }
}

export {};
