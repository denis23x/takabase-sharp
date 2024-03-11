/** @format */

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: string;
      APP_PORT: number;
      APP_HOST: string;
    };
  }
}

export {};
