//import prisma from '../../../prisma/client.js'
import crypto from 'crypto'
import { buildMerkleRoot } from './merkle.js'
import prisma from '../../prisma/client.js'

export async function createBatchHash(sensorId) {
  const readings = await prisma.reading.findMany({
    where: { sensorId 
      ,batched: false
    },
    orderBy: { timestamp: 'asc' },
    take: 10
  })

  if (readings.length < 10) {
    console.log("menor a 10 jejej otra vez")
    return null
  }

  //const hashes = readings.map(r => r.hash)
  const hashes = readings
  .map(r=>r.hash)
  .filter(Boolean)

  const merkleRoot = buildMerkleRoot(hashes)
  const sensor = await prisma.sensor.findUnique({
    where: { id: sensorId },
    select: { deviceId: true }
  })

  const record = await prisma.blockchainRecord.create({
    data: {
      deviceId: sensor.deviceId,
      action: "MERKLE_ROOT",
      hash: merkleRoot,
      batchData: hashes
    }
  })

  console.log('al fin mayor a 10 ver la tabla')
  await prisma.reading.updateMany({
    where: {
      id:{
        in : readings.map(r=> r.id)
      }
    },
    data:{
      batched: true
    }
  })
  console.log("Merkle Root creado", merkleRoot)

  return record
}