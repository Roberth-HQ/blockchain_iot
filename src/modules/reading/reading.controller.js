import {
  createReadingService,
  getAllReadingsService,
  getReadingByIdService,
  deleteReadingService
} from './reading.service.js'

export async function createReadingController(request, reply) {
  try {
    const { value, sensorId } = request.body

    if (value === undefined || !sensorId) {
      return reply.status(400).send({
        message: 'value and sensorId are required'
      })
    }

    const reading = await createReadingService({ value, sensorId })

    return reply.status(201).send(reading)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function getAllReadingsController(request, reply) {
  try {
    const readings = await getAllReadingsService()
    return reply.send(readings)
  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function getReadingByIdController(request, reply) {
  try {
    const { id } = request.params

    const reading = await getReadingByIdService(id)

    if (!reading) {
      return reply.status(404).send({ message: 'Reading not found' })
    }

    return reply.send(reading)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function deleteReadingController(request, reply) {
  try {
    const { id } = request.params

    await deleteReadingService(id)

    return reply.send({ message: 'Reading deleted' })

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}