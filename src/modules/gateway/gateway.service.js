import prisma from '../../../prisma/client.js'

export async function createGatewayService({
  name,
  publicKey,
  firmware
}) {
  return prisma.gateway.create({
    data: {
      name: name || null,
      publicKey,
      firmware: firmware || null
    }
  })
}

export async function getAllGatewaysService() {
  return prisma.gateway.findMany({
    include: {
      devices: true
    }
  })
}

export async function getGatewayByIdService(id) {
  return prisma.gateway.findUnique({
    where: { id },
    include: {
      devices: true
    }
  })
}

export async function updateGatewayService(id, data) {
  return prisma.gateway.update({
    where: { id },
    data
  })
}

export async function deactivateGatewayService(id) {
  return prisma.gateway.update({
    where: { id },
    data: {
      firmware: null
    }
  })
}