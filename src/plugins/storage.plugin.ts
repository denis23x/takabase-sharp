/** @format */

import fp from 'fastify-plugin';
import { storageConfig } from '../config/storage.config';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { Bucket, File } from '@google-cloud/storage';
import type { DownloadResponse } from '@google-cloud/storage/build/cjs/src/file';
import type { Storage } from 'firebase-admin/storage';

const storagePlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  const storage: Storage = getStorage();
  const bucket: Bucket = getStorage().bucket(storageConfig.bucket);

  fastifyInstance.decorate('storage', storage);

  fastifyInstance.decorate('storageBucket', bucket);

  fastifyInstance.decorate('storagePlugin', {
    getDownloadURL: async (imageUrl: string): Promise<string> => {
      const url: URL = new URL(decodeURIComponent(imageUrl));
      const urlPath: string = url.pathname.split('/o/').pop();

      const file: File = fastifyInstance.bucket.file(urlPath);

      return getDownloadURL(file);
    },
    getFile: async (imageUrl: string): Promise<DownloadResponse> => {
      const url: URL = new URL(decodeURIComponent(imageUrl));
      const urlPath: string = url.pathname.split('/o/').pop();

      return fastifyInstance.bucket.file(urlPath).download();
    }
  });
});

export default storagePlugin;
