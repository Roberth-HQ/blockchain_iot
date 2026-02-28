import{
    loginService
}from './auth.service.js'

export async function loginController(request, reply) {
  try {

    const { email, password } = request.body

    const user = await loginService(email, password)

    const token = request.server.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return { token }

  } catch (error) {
    return reply.status(401).send({ error: error.message })
  }
}
