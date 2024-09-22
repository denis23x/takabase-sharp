/** @format */

import appCheckMethod from './app-check';
import downloadUrlMethod from './download-url';
import storageMethod from './storage';
import webpMethod from './webp';
import type { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(appCheckMethod);
  fastify.register(downloadUrlMethod);
  fastify.register(storageMethod);
  fastify.register(webpMethod);
}
