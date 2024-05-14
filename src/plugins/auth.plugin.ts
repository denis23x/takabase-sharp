/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { getAuth } from 'firebase-admin/auth';

const authPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('auth', getAuth(fastifyInstance.firebase()));
});

export default authPlugin;
