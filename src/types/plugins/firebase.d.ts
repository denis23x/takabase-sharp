/** @format */

import type { App } from 'firebase-admin/app';

declare module 'fastify' {
  interface FastifyInstance {
    firebase: () => App;
  }
}

export {};
