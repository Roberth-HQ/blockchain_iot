import { syncController } from './sync.controller.js'

export default async function syncRoutes(fastify) {
  fastify.post('/', syncController)
}