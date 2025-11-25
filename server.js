import blockchainRoutes from './src/routes/blockchain.route.js';
import authRoutes from './src/routes/auth.route.js';
import devicesRoutes from './src/routes/devices.route.js';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify from 'fastify';
import { startMQTT } from './src/mqtt/mqttClient.js';
import Blockchain from './src/blockchain/blockchain.js';
const fastify = Fastify({ logger: true });
fastify.register(authRoutes);
fastify.register(devicesRoutes);
fastify.register(blockchainRoutes);
const chain = new Blockchain();
// Registrar CORS
fastify.register(cors, {
  origin: '*'
});

// Registrar JWT
fastify.register(jwt, {
  secret: 'supersecreto123'
});

// Ruta simple
fastify.get('/', async (request, reply) => {
  return { message: 'Backend IoT funcionando' };
});
startMQTT(chain);

// Iniciar servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("Servidor corriendo en http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
