import prisma from '../../../prisma/client.js'

export async function createSensorService({
  name,
  type,
  unit,
  minThreshold,
  maxThreshold,
  deviceId
}) {
  return prisma.sensor.create({
    data: {
      name: name || null,
      type,
      unit: unit || null,
      minThreshold: minThreshold || null,
      maxThreshold: maxThreshold || null,
      deviceId
    }
  })
}

export async function getAllSensorsService() {
  return prisma.device.findMany({
    include: {
      sensors: true, // <--- ESTO ES VITAL
      gateway: true
    }
  })
}

export async function getSensorByIdService(id) {
  return prisma.sensor.findUnique({
    where: { id },
    include: {
      device: true,
      readings: {
        orderBy: { timestamp: 'desc' }, // <--- Esto hará que el Front muestre lo más nuevo arriba
        take: 50 // Opcional: Limitar a las últimas 50 para no saturar
      }
    }
  })
}

export async function updateSensorService(id, data) {
  return prisma.sensor.update({
    where: { id },
    data
  })
}

export async function deleteSensorService(id) {
  return prisma.sensor.delete({
    where: { id }
  })
}