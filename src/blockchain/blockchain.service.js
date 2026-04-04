import prisma from '../../prisma/client.js'
import { buildMerkleRoot } from './merkle.js'
import crypto from 'crypto' // Necesario para el hash del bloque

export async function createBatchHash(sensorId) {
  // 1. Buscamos 10 lecturas
  const readings = await prisma.reading.findMany({
    where: { sensorId, batched: false },
    orderBy: { timestamp: 'asc' },
    take: 10
  })

  if (readings.length < 10) return null

  // 2. Extraemos hashes y generamos Merkle Root
  const hashes = readings.map(r => r.hash).filter(Boolean)
  const merkleRoot = buildMerkleRoot(hashes)

  // 3. LOGICA POR DISPOSITIVO: Buscamos el dispositivo
  const sensor = await prisma.sensor.findUnique({
    where: { id: sensorId },
    select: { deviceId: true }
  })

  // 4. INMUTABILIDAD EN CASCADA: Buscamos el último bloque DE ESTE DISPOSITIVO
  const lastBlock = await prisma.blockchainRecord.findFirst({
    where: { deviceId: sensor.deviceId },
    orderBy: { createdAt: 'desc' }
  })

  const previousHash = lastBlock ? lastBlock.blockHash : "0000000000000000"
  const timestamp = new Date().toISOString()

  // 5. GENERACIÓN DEL BLOCK HASH (El sello de integridad del bloque)
  // Concatenamos todo para que nada sea alterable
  const blockHash = crypto
    .createHash("sha256")
    .update(previousHash + merkleRoot + timestamp)
    .digest("hex")

  // 6. Creamos el registro con los nuevos campos de auditoría
  const record = await prisma.blockchainRecord.create({
    data: {
      deviceId: sensor.deviceId,
      action: "MERKLE_ROOT",
      merkleRoot: merkleRoot,      // Raíz de los datos
      blockHash: blockHash,        // Identificador único del bloque
      previousHash: previousHash,  // Link al bloque anterior
      batchData: hashes,           // Los 10 hashes originales para auditoría
      createdAt: timestamp         // Sello de tiempo autorizado
    }
  })

  // 7. Marcamos las lecturas como procesadas
  await prisma.reading.updateMany({
    where: { id: { in: readings.map(r => r.id) } },
    data: { batched: true }
  })

  return record
}

/**
 * PUNTO 1 y 5: Función de Verificación de Integridad
 * Esta función la llamará tu botón del Frontend
 */
export async function verifyBlockIntegrity(blockId) {
  const block = await prisma.blockchainRecord.findUnique({
    where: { id: blockId }
  })

  if (!block) throw new Error("Bloque no encontrado")

  // Re-calculamos el Merkle Root con los datos que guardamos en la DB
  const recalculatedMerkle = buildMerkleRoot(block.batchData)
  
  // Verificamos si coincide
  const isMerkleValid = recalculatedMerkle === block.merkleRoot

  // Verificamos el bloque completo (Cascada)
  const recalculatedBlockHash = crypto
    .createHash("sha256")
    .update(block.previousHash + block.merkleRoot + block.createdAt.toISOString())
    .digest("hex")

  const isChainValid = recalculatedBlockHash === block.blockHash

  return {
    isValid: isMerkleValid && isChainValid,
    details: {
      merkle: isMerkleValid,
      chain: isChainValid
    }
  }
}




/**
 * PUNTO 6: Escaneo de Auditoría Global
 * Verifica que toda la cadena de un dispositivo sea íntegra.
 */
export async function auditFullChain(deviceId) {
  const blocks = await prisma.blockchainRecord.findMany({
    where: { deviceId },
    orderBy: { createdAt: 'asc' } // Los revisamos en orden cronológico
  })

  let chainStatus = []
  let isValidChain = true

  for (let i = 0; i < blocks.size; i++) {
    const currentBlock = blocks[i]
    const previousBlock = blocks[i - 1]

    // 1. Verificar el Génesis (el primero no tiene previo)
    if (i === 0) {
      const isGenesisOk = currentBlock.previousHash === "0" || currentBlock.previousHash === "0000000000000000"
      chainStatus.push({ blockId: currentBlock.id, status: isGenesisOk ? "OK" : "CORRUPT_GENESIS" })
      if (!isGenesisOk) isValidChain = false
      continue
    }

    // 2. Verificar el eslabón (The Chain Link)
    const isLinkValid = currentBlock.previousHash === previousBlock.blockHash
    
    // 3. Verificar el Hash del bloque actual (Intrínseco)
    const recalculatedHash = crypto
      .createHash("sha256")
      .update(currentBlock.previousHash + currentBlock.merkleRoot + currentBlock.createdAt.toISOString())
      .digest("hex")
    
    const isSelfValid = recalculatedHash === currentBlock.blockHash

    if (!isLinkValid || !isSelfValid) {
      isValidChain = false
      chainStatus.push({ 
        blockId: currentBlock.id, 
        status: "BROKEN", 
        reason: !isLinkValid ? "Enlace roto con bloque anterior" : "Datos del bloque alterados"
      })
    } else {
      chainStatus.push({ blockId: currentBlock.id, status: "OK" })
    }
  }

  return { deviceId, isValidChain, report: chainStatus }
}