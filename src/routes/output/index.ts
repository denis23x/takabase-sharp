/** @format */

import { FastifyInstance } from 'fastify';

import downloadUrlMethod from './download-url';
import webpMethod from './webp';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(downloadUrlMethod);
  fastify.register(webpMethod);
}
