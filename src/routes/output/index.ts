/** @format */

import { FastifyInstance } from 'fastify';

import webpMethod from './webp';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(webpMethod);
}
