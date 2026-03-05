import prisma from '../../../prisma/client.js'

export async function createDeviceService({ deviceId, name, gatewayId, locationId }) {
  return prisma.device.create({
    data: {
      deviceId,
      name: name || null,
      gatewayId: gatewayId || null,
      locationId: locationId || null,
      status: 'PENDING'
    }
  })
}

export async function getAllDevicesService() {
  return prisma.device.findMany({
    include: {
      gateway: true,
      sensors: true
    }
  })
}

export async function getDeviceByIdService(id) {
  return prisma.device.findUnique({
    where: { id },
    include: {
      gateway: true,
      sensors: true
    }
  })
}

export async function revokeDeviceService(id) {
  return prisma.device.update({
    where: { id },
    data: {
      status: 'REVOKED'
    }
  })
}

export async function connectDeviceService(deviceId) {

  const device= await prisma.device.findUnique({
    where:{deviceId}
  })

  if (!device){
    return null
  }

  return prisma.device.update({
    where:{deviceId},
    data:{
      status:'ACTIVE',
      lastSeen: new Date()
    }
  })
  
}