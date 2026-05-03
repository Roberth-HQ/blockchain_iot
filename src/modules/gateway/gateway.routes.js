import {
  createGatewayController,
  getAllGatewaysController,
  getGatewayByIdController,
  updateGatewayController,
  deactivateGatewayController,
  registerGatewayController,
  receiveDataController
} from './gateway.controller.js'

export default async function gatewayRoutes(fastify) {
  fastify.post('/', createGatewayController)
  fastify.get('/', getAllGatewaysController)
  fastify.get('/:id', getGatewayByIdController)
  fastify.put('/:id', updateGatewayController)
  fastify.patch('/:id/deactivate', deactivateGatewayController)

  // NUEVAS RUTAS PARA EL ESP32
  fastify.post('/register', registerGatewayController) // Handshake inicial
  fastify.post('/data', receiveDataController)         // Recepción de JSON|FIRMA
}