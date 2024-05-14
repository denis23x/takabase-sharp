/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { File } from '@google-cloud/storage';
import { storageConfig } from '../config/storage.config';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

const storagePlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('storage', getStorage().bucket(storageConfig.bucket));

  fastifyInstance.decorate('storagePlugin', {
    getDownloadURL: async (imageUrl: string): Promise<string> => {
      const url: URL = new URL(decodeURIComponent(imageUrl));
      const urlPath: string = url.pathname.split('/o/').pop();

      const file: File = fastifyInstance.storage.file(urlPath);

      return getDownloadURL(file);
    }
  });
});

export default storagePlugin;
