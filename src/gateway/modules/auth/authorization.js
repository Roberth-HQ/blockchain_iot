import fp from 'fastify-plugin'

async function authorizationPlugin(fastify, options) {

  console.log("PLUGIN AUTHORIZATION REGISTRADO")

  fastify.decorate('authorize', function(requiredRole) {

    return async function (request, reply) {

      console.log("AUTHORIZE EJECUTADO")

      const user = request.user

      if (!user) {
        return reply.code(401).send({ error: 'No autenticado' })
      }

      if (user.role !== requiredRole) {
        return reply.code(403).send({ error: 'No autorizado' })
      }

    }

  })

}

export default fp(authorizationPlugin)