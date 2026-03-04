import { syncReadingsService } from './sync.service.js'

export async function syncController(request, reply) {
  try {

    const { gatewayId, deviceCode, readings } = request.body

    if (!gatewayId || !deviceCode || !readings?.length) {
      return reply.status(400).send({
        message: 'Invalid sync payload'
      })
    }

    const result = await syncReadingsService({
      gatewayId,
      deviceCode,
      readings
    })

    return reply.status(200).send({
      message: 'Sync successful',
      ...result
    })

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}