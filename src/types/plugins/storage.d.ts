/** @format */

import type { Storage } from 'firebase-admin/storage';
import type { Bucket, DownloadResponse } from '@google-cloud/storage';

declare module 'fastify' {
  interface FastifyInstance {
    storage: Storage;
    storageBucket: Bucket;
    storagePlugin: {
      getDownloadURL: (imageUrl: string) => Promise<string>;
      getFile: (imageUrl: string) => Promise<DownloadResponse>;
    };
  }
}

export {};
