import prisma from '../../../prisma/client.js'

export async function createReadingService({ value, sensorId }) {
  return prisma.reading.create({
    data: {
      value,
      sensorId
    }
  })
}

export async function getAllReadingsService() {
  return prisma.reading.findMany({
    include: {
      sensor: true
    }
  })
}

export async function getReadingByIdService(id) {
  return prisma.reading.findUnique({
    where: { id },
    include: {
      sensor: true
    }
  })
}

export async function deleteReadingService(id) {
  return prisma.reading.delete({
    where: { id }
  })
}