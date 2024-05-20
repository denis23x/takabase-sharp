/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { initializeApp, getApp, cert, App, getApps } from 'firebase-admin/app';

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
