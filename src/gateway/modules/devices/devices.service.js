import prisma from '../../../../prisma/client.js'

export async function createDeviceService(deviceId, name) {

  return await prisma.device.create({
    data: {
      deviceId,
      name: name || null,
      status: 'PENDING'
    }
  })
}

export async function getAllDevicesService() {
  return await prisma.device.findMany()
}

export async function getDeviceByIdService(id) {
  return await prisma.device.findUnique({
    where: { id }
  })
}

export async function revokeDeviceService(id) {
  return await prisma.device.update({
    where: { id },
    data: {
      status: 'REVOKED'
    }
  })
}