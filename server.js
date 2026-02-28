import blockchainRoutes from './src/gateway/routes/blockchain.route.js';
import authRoutes from './src/gateway/modules/auth/auth.route.js';
import devicesRoutes from './src/gateway/routes/devices.route.js';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify from 'fastify';
import { startMQTT } from './src/mqtt/mqttClient.js';
import Blockchain from './src/blockchain/blockchain.js';
import gatewayRoutes from './src/gateway/gateway.route.js';
const fastify = Fastify({ logger: true });
fastify.register(authRoutes);
fastify.register(devicesRoutes);
fastify.register(blockchainRoutes);
fastify.register(gatewayRoutes);
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
