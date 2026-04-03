import prisma from '../../prisma/client.js'
import { buildMerkleRoot } from './merkle.js'

export async function createBatchHash(sensorId) {
  // 1. Buscamos 10 lecturas que no estén en un lote aún
  const readings = await prisma.reading.findMany({
    where: { sensorId, batched: false },
    orderBy: { timestamp: 'asc' },
    take: 10
  })

  if (readings.length < 10) return null

  // 2. Extraemos los hashes de las lecturas para el Merkle Tree
  const hashes = readings.map(r => r.hash).filter(Boolean)
  const merkleRoot = buildMerkleRoot(hashes)

  // 3. LOGICA DE ENCADENAMIENTO: Buscamos el último registro de la cadena global
  const lastBlock = await prisma.blockchainRecord.findFirst({
    orderBy: { createdAt: 'desc' }
  })

  // Si no hay bloques previos, el previousHash es "0" (Génesis)
  const previousHash = lastBlock ? lastBlock.hash : "0"

  // 4. Buscamos el dispositivo para la relación
  const sensor = await prisma.sensor.findUnique({
    where: { id: sensorId },
    select: { deviceId: true }
  })

  // 5. Creamos el registro en la Blockchain
  const record = await prisma.blockchainRecord.create({
    data: {
      deviceId: sensor.deviceId,
      action: "MERKLE_ROOT",
      hash: merkleRoot,       // Este es el actual
      previousHash: previousHash, // Este es el link al pasado
      batchData: hashes       // Guardamos los hashes de las 10 lecturas
    }
  })

  // 6. Marcamos las lecturas como "ya procesadas"
  await prisma.reading.updateMany({
    where: { id: { in: readings.map(r => r.id) } },
    data: { batched: true }
  })

  return record
}