import bcrypt from 'bcrypt'
import pool from '../db.js'

export default async function authRoutes(fastify, options) {

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body

    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return reply.status(401).send({ error: 'Credenciales inválidas' })
    }

    const admin = result.rows[0]

    const validPassword = await bcrypt.compare(password, admin.password)

    if (!validPassword) {
      return reply.status(401).send({ error: 'Credenciales inválidas' })
    }

    const token = fastify.jwt.sign({
      id: admin.id,
      email: admin.email,
      role: admin.role
    })

    return { token }
  })

}