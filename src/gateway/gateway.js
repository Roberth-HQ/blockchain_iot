import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';

const fastify = Fastify({ logger: true });

// Proxy → redirige todas las rutas al servidor principal
fastify.register(proxy, {
  upstream: 'http://localhost:3000',
  prefix: '/', 
});

fastify.listen({ port: 4000 }, (err) => {
  if (err) throw err;
  console.log('Gateway corriendo en http://localhost:4000');
});
