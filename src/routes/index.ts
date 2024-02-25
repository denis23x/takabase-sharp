/** @format */

import { FastifyInstance } from 'fastify';

import metadataMethod from './metadata';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(metadataMethod);
}
