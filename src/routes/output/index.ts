/** @format */

import { FastifyInstance } from 'fastify';

import appCheckMethod from './app-check';
import downloadUrlMethod from './download-url';
import webpMethod from './webp';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(appCheckMethod);
  fastify.register(downloadUrlMethod);
  fastify.register(webpMethod);
}
