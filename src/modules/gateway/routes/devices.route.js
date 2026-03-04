// src/routes/devices.route.js
export default async function deviceRoutes(fastify, options) {

  fastify.post('/devices/auth', async (request, reply) => {
    const { deviceId, secret } = request.body;

    return { message: 'Dispositivo autenticado', deviceId };
  });

  fastify.post('/devices/data', async (request, reply) => {
    const { deviceId, payload } = request.body;

    return { message: 'Datos recibidos', deviceId, payload };
  });

}

//module.exports = deviceRoutes;
