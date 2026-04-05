import prisma from '../../../prisma/client.js'
import { generateReadingHash } from '../../../utils/hash.js'
import { createBatchHash } from '../../blockchain/blockchain.service.js'

export async function createReadingService({ value, sensorId, deviceId, signature }) {
  // 1. Buscamos el sensor directamente por su ID
  const sensor = await prisma.sensor.findUnique({
    where: { id: sensorId }
  });

  if (!sensor) throw new Error("Sensor no encontrado");

  // 2. VALIDACIÓN DIRECTA (String contra String)
  // Usamos el campo deviceId que ya viene plano en el objeto sensor
  if (sensor.deviceId !== deviceId) {
    throw new Error("Fraude detectado: El dispositivo no es dueño de este sensor.");
  }

  // 3. Verificamos el estado del dispositivo dueño
  const deviceOwner = await prisma.device.findUnique({
    where: { id: sensor.deviceId }
  });

  if (!deviceOwner || deviceOwner.status !== 'ACTIVE') {
    throw new Error(`Acceso denegado: Dispositivo no encontrado o estado ${deviceOwner?.status}`);
  }

  // 4. REGISTRO DE LA LECTURA
  const timestamp = new Date();
  const numericValue = parseFloat(value);
  const hash = generateReadingHash(sensorId, numericValue, timestamp);

  const reading = await prisma.reading.create({
    data: {
      value: numericValue,
      sensorId: sensorId,
      timestamp: timestamp,
      hash: hash
    }
  });

  // 5. BLOCKCHAIN BATCHING
  await createBatchHash(sensorId);

  return reading;
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