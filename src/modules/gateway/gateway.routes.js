import {
  createGatewayController,
  getAllGatewaysController,
  getGatewayByIdController,
  updateGatewayController,
  deactivateGatewayController
} from './gateway.controller.js'

export default async function gatewayRoutes(fastify) {
  fastify.post('/', createGatewayController)
  fastify.get('/', getAllGatewaysController)
  fastify.get('/:id', getGatewayByIdController)
  fastify.put('/:id', updateGatewayController)
  fastify.patch('/:id/deactivate', deactivateGatewayController)
}