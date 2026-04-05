import {
  createReadingService,
  getAllReadingsService,
  getReadingByIdService,
  deleteReadingService
} from './reading.service.js'

export async function createReadingController(request, reply) {
  try {
    // 1. EXTRAER TODO DEL BODY (Añadimos deviceId y signature)
    const { value, sensorId, deviceId, signature } = request.body

    // 2. VALIDACIÓN DE ENTRADA (Ahora pedimos también el deviceId)
    if (value === undefined || !sensorId || !deviceId) {
      return reply.status(400).send({
        message: 'value, sensorId and deviceId are required'
      })
    }

    // 3. PASAR TODO AL SERVICIO
    // Ahora el servicio recibirá el deviceId y no dará "undefined"
    const reading = await createReadingService({ value, sensorId, deviceId, signature })

    return reply.status(201).send(reading)

  } catch (error) {
    // Si el servicio lanza el error de "Fraude", caerá aquí
    return reply.status(403).send({ error: error.message })
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