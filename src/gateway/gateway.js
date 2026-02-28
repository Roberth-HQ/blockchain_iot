import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import fastifyJwt from '@fastify/jwt';
import authRoutes from './modules/auth/auth.route.js';

const fastify = Fastify({ logger: true });

// JWT
fastify.register(fastifyJwt, {
  secret: 'supersecretkey'
});

// Middleware Auth
//fastify.decorate("authorize", authorize)
fastify.decorate("authenticate", async function(request, reply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
});

// Rutas Auth
fastify.register(authRoutes, { prefix: '/auth' });

// Proxy SOLO para blockchain
fastify.register(proxy, {
  upstream: 'http://localhost:3000',
  prefix: '/blockchain',
});

fastify.listen({ port: 4000 }, (err) => {
  if (err) throw err;
  console.log('Gateway corriendo en http://localhost:4000');
});