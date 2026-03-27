import Fastify from 'fastify';
import cors from '@fastify/cors';
import proxy from '@fastify/http-proxy';
import fastifyJwt from '@fastify/jwt';
import authorizationPlugin from '../auth/authorization.js';
import authRoutes from '../auth/auth.route.js';
import userRoutes from '../users/users.routes.js'
import devicesRoutes from '../devices/devices.routes.js';
import readingRoutes from '../reading/reading.routes.js';
import sensorRoutes from '../sensors/sensors.routes.js';
import syncRoutes from '../sync/sync.routes.js';
import gatewayRoutes from './gateway.routes.js';
import { locationRoutes } from '../location/location.routes.js';  
import { projectRoutes } from '../project/proyect.routes.js';

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

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // <--- AGREGAR ESTO
  allowedHeaders: ['Content-Type', 'Authorization']
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
fastify.register(readingRoutes,{prefix: '/readings' })
//rutas de sycroinzacion
fastify.register(syncRoutes,{prefix: '/sync' })
//rutas de gateway
fastify.register(gatewayRoutes,{prefix: '/gateways' })
//rutas location
fastify.register(locationRoutes,{ prefix:'/location' })
//rutas proyectos
fastify.register(projectRoutes,{prefix:'/project'})


// Proxy SOLO para blockchain
fastify.register(proxy, {
  upstream: 'http://localhost:3000',
  prefix: '/blockchain',
});

fastify.listen({ port: 4000,host:'0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log('Gateway corriendo en http://localhost:4000');
});