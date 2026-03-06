import prisma from '../../../prisma/client.js'
import crypto from 'crypto'

export async function createBatchHash(sensorId) {

  const readings = await prisma.reading.findMany({
    where: { sensorId },
    orderBy: { timestamp: 'asc' },
    take: 10
  })

  if (readings.length < 10) {
    return null
  }

  const hashes = readings.map(r => r.hash).join('')

  const batchHash = crypto
    .createHash('sha256')
    .update(hashes)
    .digest('hex')

  const deviceId = await prisma.sensor.findUnique({
    where: { id: sensorId },
    select: { deviceId: true }
  })

  const record = await prisma.blockchainRecord.create({
    data: {
      deviceId: deviceId.deviceId,
      action: 'BATCH_HASH',
      hash: batchHash
    }
  })

  return record
}