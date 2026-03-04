import prisma from '../../../prisma/client.js'

export async function createDeviceService({ deviceCode, name, gatewayId }) {
  return prisma.device.create({
    data: {
      deviceCode,
      name: name || null,
      gatewayId: gatewayId || null,
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