import {
  createDeviceController,
  getAllDevicesController,
  getDeviceByIdController,
  revokeDeviceController,
  connectDeviceController,
  activateDeviceController,
  updateDeviceController,
  deleteDeviceController
} from './devices.controller.js'

export default async function devicesRoutes(fastify, options) {

  fastify.post('/', createDeviceController)
  fastify.get('/', getAllDevicesController)
  fastify.get('/:id', getDeviceByIdController)
  fastify.patch('/:id/revoke', revokeDeviceController)
  fastify.post('/connect', connectDeviceController)
  fastify.patch('/:id/activate', activateDeviceController) // Para des-revocar
  fastify.put('/:id', updateDeviceController)             // Para editar nombre/datos
  fastify.delete('/:id', deleteDeviceController)          // Para eliminar físicamente

}