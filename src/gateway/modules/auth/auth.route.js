import { loginController
 } from './auth.controller.js'

export default async function authRoutes(fastify, options) {

  fastify.post('/login', loginController)

}

