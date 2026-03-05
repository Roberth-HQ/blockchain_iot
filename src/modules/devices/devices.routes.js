import {
  createDeviceController,
  getAllDevicesController,
  getDeviceByIdController,
  revokeDeviceController,
  connectDeviceController
} from './devices.controller.js'

export default async function devicesRoutes(fastify, options) {

  fastify.post('/', createDeviceController)
  fastify.get('/', getAllDevicesController)
  fastify.get('/:id', getDeviceByIdController)
  fastify.patch('/:id/revoke', revokeDeviceController)
  fastify.post('/connect', connectDeviceController)

}