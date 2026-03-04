import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import fastifyJwt from '@fastify/jwt';
import authorizationPlugin from '../auth/authorization.js';
import authRoutes from '../auth/auth.route.js';
import userRoutes from '../users/users.routes.js'
import devicesRoutes from '../devices/devices.routes.js';
import readingRoutes from '../reading/reading.routes.js';
import sensorRoutes from '../sensors/sensors.routes.js';

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
//rutas dispositivos
fastify.register(devicesRoutes, {prefix: '/devices' })
//rutas de sensores
fastify.register(sensorRoutes,{prefix: '/sensors' })
//rutas de readings
fastify.register(readingRoutes,{prefix: '/reading' })

// Proxy SOLO para blockchain
fastify.register(proxy, {
  upstream: 'http://localhost:3000',
  prefix: '/blockchain',
});

fastify.listen({ port: 4000 }, (err) => {
  if (err) throw err;
  console.log('Gateway corriendo en http://localhost:4000');
});