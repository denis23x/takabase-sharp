/** @format */

import { FastifyInstance } from 'fastify';

import textMethod from './text';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(textMethod);
}
