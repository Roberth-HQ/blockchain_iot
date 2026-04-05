import {
  createDeviceService,
  getAllDevicesService,
  getDeviceByIdService,
  revokeDeviceService,
  connectDeviceService,
  activateDeviceService,
  updateDeviceService,
  deleteDeviceService
} from './devices.service.js'

export async function createDeviceController(request, reply) {
  try {
    const { deviceId, name, gatewayId ,locationId} = request.body

    if (!deviceId) {
      return reply.status(400).send({ message: 'deviceId is required' })
    }
    const device = await createDeviceService({
      deviceId,
      name,
      gatewayId,
      locationId
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

export async function connectDeviceController(request, reply) {
  const { deviceId, publicKey } = request.body;

  if (!deviceId || !publicKey) {
    return reply.code(400).send({ 
      error: "Se requiere deviceId (ChipID) y publicKey para la activación." 
    });
  }

  try {
    const activatedDevice = await connectDeviceService(deviceId, publicKey);
    return {
      message: "Dispositivo activado y vinculado correctamente",
      device: {
        name: activatedDevice.name,
        status: activatedDevice.status
      }
    };
  } catch (error) {
    return reply.code(403).send({ error: error.message });
  }
}

export async function activateDeviceController(request, reply) {
  try {
    const { id } = request.params
    const device = await activateDeviceService(id)
    return reply.send({ message: 'Dispositivo activado con éxito', device })
  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function updateDeviceController(request, reply) {
  try {
    const { id } = request.params
    const { name, gatewayId, locationId } = request.body
    const device = await updateDeviceService(id, { name, gatewayId, locationId })
    return reply.send(device)
  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function deleteDeviceController(request, reply) {
  try {
    const { id } = request.params
    await deleteDeviceService(id)
    return reply.status(204).send()
  } catch (error) {
    console.error("ERROR EN DELETE:", error) // <-- AGREGA ESTO
    return reply.status(500).send({ error: error.message })
  }
}