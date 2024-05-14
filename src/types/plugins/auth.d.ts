/** @format */

import { Auth } from 'firebase-admin/auth';

declare module 'fastify' {
  interface FastifyInstance {
    auth: Auth;
  }
}

export {};
