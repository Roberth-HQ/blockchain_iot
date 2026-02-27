// src/routes/auth.route.js
export default async function authRoutes(fastify, options) {
  
  fastify.post('/auth/register', async (request, reply) => {
    const { username, password } = request.body;

    return { message: 'Usuario registrado', username };
  });

  fastify.post('/auth/login', async (request, reply) => {
    const { username, password } = request.body;

    return { token: 'fake-jwt-token', username };
  });

}

//module.exports = authRoutes;
