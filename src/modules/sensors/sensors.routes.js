import {
  createSensorController,
  getAllSensorsController,
  getSensorByIdController,
  updateSensorController,
  deleteSensorController
} from './sensors.controller.js'

export default async function sensorRoutes(fastify) {
  fastify.post('/', createSensorController)
  fastify.get('/', getAllSensorsController)
  fastify.get('/:id', getSensorByIdController)
  fastify.put('/:id', updateSensorController)
  fastify.delete('/:id', deleteSensorController)
}