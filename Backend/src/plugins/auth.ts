import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function (app: FastifyInstance) {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me-in-production';
  
  await app.register(fastifyJwt, { 
    secret,
    sign: {
      expiresIn: '24h'
    }
  });

  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ 
        success: false, 
        error: 'Authentication required' 
      });
    }
  });
});
