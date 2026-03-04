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
  return prisma.sensor.findMany({
    include: {
      device: true
    }
  })
}

export async function getSensorByIdService(id) {
  return prisma.sensor.findUnique({
    where: { id },
    include: {
      device: true,
      readings: true
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