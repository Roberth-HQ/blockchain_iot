import {
  createSensorService,
  getAllSensorsService,
  getSensorByIdService,
  updateSensorService,
  deleteSensorService
} from './sensors.service.js'

export async function createSensorController(request, reply) {
  try {
    const { type, deviceId } = request.body

    if (!type || !deviceId) {
      return reply.status(400).send({
        message: 'type and deviceId are required'
      })
    }

    const sensor = await createSensorService(request.body)

    return reply.status(201).send(sensor)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function getAllSensorsController(request, reply) {
  try {
    const sensors = await getAllSensorsService()
    return reply.send(sensors)
  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function getSensorByIdController(request, reply) {
  try {
    const { id } = request.params

    const sensor = await getSensorByIdService(id)

    if (!sensor) {
      return reply.status(404).send({ message: 'Sensor not found' })
    }

    return reply.send(sensor)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function updateSensorController(request, reply) {
  try {
    const { id } = request.params

    const sensor = await updateSensorService(id, request.body)

    return reply.send(sensor)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function deleteSensorController(request, reply) {
  try {
    const { id } = request.params

    await deleteSensorService(id)

    return reply.send({ message: 'Sensor deleted' })

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}