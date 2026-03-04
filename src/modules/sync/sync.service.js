import prisma from '../../../prisma/client.js'

export async function syncReadingsService({ gatewayId, deviceCode, readings }) {

  // 1️⃣ Verificar gateway
  const gateway = await prisma.gateway.findUnique({
    where: { id: gatewayId }
  })

  if (!gateway) {
    throw new Error('Gateway not found')
  }

  // 2️⃣ Verificar device
  const device = await prisma.device.findUnique({
    where: { deviceCode }
  })

  if (!device) {
    throw new Error('Device not found')
  }

  // 3️⃣ Insertar lecturas en lote
  const createdReadings = await prisma.reading.createMany({
    data: readings.map(r => ({
      value: r.value,
      timestamp: new Date(r.timestamp),
      sensorId: r.sensorId
    }))
  })

  return {
    inserted: createdReadings.count
  }
}