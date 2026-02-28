import prisma from '../../../prisma/client.js'
import bcrypt from 'bcrypt'

export default async function authRoutes(fastify, options) {

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return reply.status(401).send({ error: 'Credenciales inválidas' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return reply.status(401).send({ error: 'Credenciales inválidas' })
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return { token }
  })

}