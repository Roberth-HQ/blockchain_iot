import {
  createDeviceController,
  getAllDevicesController,
  getDeviceByIdController,
  revokeDeviceController
} from './devices.controller.js'

export default async function devicesRoutes(fastify, options) {

  fastify.post('/', createDeviceController)
  fastify.get('/', getAllDevicesController)
  fastify.get('/:id', getDeviceByIdController)
  fastify.patch('/:id/revoke', revokeDeviceController)

}