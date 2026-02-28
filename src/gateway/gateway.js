import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import fastifyJwt from '@fastify/jwt';
import authorizationPlugin from './modules/auth/authorization.js';
import authRoutes from './modules/auth/auth.route.js';
import userRoutes from './modules/users/users.routes.js'

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

fastify.register(authorizationPlugin)
// Rutas Auth
fastify.register(authRoutes, { prefix: '/auth' });
//rutas usaurio
fastify.register(userRoutes,{prefix:'/users'});

// Proxy SOLO para blockchain
fastify.register(proxy, {
  upstream: 'http://localhost:3000',
  prefix: '/blockchain',
});

fastify.listen({ port: 4000 }, (err) => {
  if (err) throw err;
  console.log('Gateway corriendo en http://localhost:4000');
});