/** @format */

import { FastifyInstance } from 'fastify';

import fetchMethod from './fetch';
import metadataMethod from './metadata';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(fetchMethod);
  fastify.register(metadataMethod);
}
