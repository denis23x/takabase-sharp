/** @format */

import fp from 'fastify-plugin';
import { getAuth } from 'firebase-admin/auth';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { Auth } from 'firebase-admin/auth';

const authPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  const auth: Auth = getAuth(fastifyInstance.firebase());

  fastifyInstance.decorate('auth', auth);
});

export default authPlugin;
