import prisma from '../../../prisma/client.js'
import { generateReadingHash } from '../../../utils/hash.js'
import { createBatchHash } from '../../blockchain/blockchain.service.js'

export async function createReadingService({ value, sensorId }) {
  const timestamp = new Date()
  const hash = generateReadingHash(sensorId, value, timestamp)
  const reading= await prisma.reading.create({
    data: {
      value,
      sensorId,
      timestamp,
      hash
    }
  })
    await createBatchHash(sensorId)
    return reading
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