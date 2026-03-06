import {
  createDeviceService,
  getAllDevicesService,
  getDeviceByIdService,
  revokeDeviceService,
  connectDeviceService
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

export async function connectDeviceController(request,reply) {
  try{
    const {deviceId} = request.body

    if(!deviceId){
      return reply.status(400).send({ message: 'deviceId es requerido'})
    }
  const device = await connectDeviceService(deviceId)

  if (!device){
    return reply.status(404).send({message:'desipositivo no registrado'})
  }
  return reply.send({
    message:'Dispositivo conectado',
    device
  })

  } catch(error){
    return reply.status(500).send({ error: error.message})
  }
  
}