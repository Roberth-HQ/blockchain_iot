import {
  createDeviceService,
  getAllDevicesService,
  getDeviceByIdService,
  revokeDeviceService
} from './devices.service.js'

export async function createDeviceController(request, reply) {
  try {
    const { deviceCode, name, gatewayId } = request.body

    if (!deviceCode) {
      return reply.status(400).send({ message: 'deviceCode is required' })
    }

    const device = await createDeviceService({
      deviceCode,
      name,
      gatewayId
    })

    return reply.status(201).send(device)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function getAllDevicesController(request, reply) {
  try {
    const devices = await getAllDevicesService()
    return reply.send(devices)
  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function getDeviceByIdController(request, reply) {
  try {
    const { id } = request.params

    const device = await getDeviceByIdService(id)

    if (!device) {
      return reply.status(404).send({ message: 'Device not found' })
    }

    return reply.send(device)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function revokeDeviceController(request, reply) {
  try {
    const { id } = request.params

    const device = await revokeDeviceService(id)

    return reply.send(device)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}