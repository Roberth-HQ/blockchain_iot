import {
  createDeviceService,
  getAllDevicesService,
  getDeviceByIdService,
  revokeDeviceService
} from './devices.service.js'

export async function createDeviceController(request, reply) {
  try {
    const { deviceId, name } = request.body

    const device = await createDeviceService(deviceId, name)

    return reply.status(201).send(device)

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function getAllDevicesController(request, reply) {
  try {
    const devices = await getAllDevicesService()
    console.log("HELLO HURCAIN !!!!")
    return devices
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

    return device

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function revokeDeviceController(request, reply) {
  try {
    const { id } = request.params

    const device = await revokeDeviceService(id)

    return device

  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}