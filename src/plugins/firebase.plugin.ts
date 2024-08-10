/** @format */

import fp from 'fastify-plugin';
import { initializeApp, getApp, cert, getApps } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const firebasePlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('firebase', (): App => {
    if (getApps().length) {
      return getApp();
    } else {
      return initializeApp({
        credential: cert(JSON.parse(process.env.APP_SERVICE_ACCOUNT))
      });
    }
  });
});

export default firebasePlugin;
