import prisma from '../../../prisma/client.js'
import crypto from 'crypto';
import { createVerify } from 'node:crypto';

export async function createGatewayService({
  name,
  publicKey,
  firmware
}) {
  return prisma.gateway.create({
    data: {
      name: name || null,
      publicKey,
      firmware: firmware || null
    }
  })
}

export async function getAllGatewaysService(locationId) {
  // Creamos el objeto de condición
  const where = locationId ? { locationId } : {};

  return prisma.gateway.findMany({
    where: where, // <--- AQUÍ ESTABA EL ERROR, faltaba el filtro 'where'
    include: {
      devices: true
    }
  });
}

export async function getGatewayByIdService(id) {
  return prisma.gateway.findUnique({
    where: { id },
    include: {
      devices: true
    }
  })
}

export async function updateGatewayService(id, data) {
  return prisma.gateway.update({
    where: { id },
    data
  })
}

export async function deactivateGatewayService(id) {
  return prisma.gateway.update({
    where: { id },
    data: {
      firmware: null
    }
  })
}

//////
export async function registerGatewayService({ gatewayMac, publicKey, locationId, devices }) {
  return prisma.$transaction(async (tx) => {
    // 1. Upsert del Gateway (Igual que antes)
    let gateway = await tx.gateway.findFirst({ where: { gatewayMac } });
    if (gateway) {
      gateway = await tx.gateway.update({
        where: { id: gateway.id },
        data: { publicKey, lastSeen: new Date() }
      });
    } else {
      gateway = await tx.gateway.create({
        data: { gatewayMac, publicKey, locationId, name: `GW-${gatewayMac.slice(-5)}` }
      });
    }

    // 2. Bucle para procesar CUALQUIER cantidad de dispositivos
    for (const dev of devices) {
      const device = await tx.device.upsert({
        where: { deviceId: dev.deviceId }, // ID único del nodo (ej: "NODO-TANQUE")
        update: { status: 'ACTIVE', lastSeen: new Date() },
        create: {
          deviceId: dev.deviceId,
          name: dev.name || "Nuevo Nodo",
          gatewayId: gateway.id,
          locationId: locationId,
          status: 'ACTIVE'
        }
      });

      // 3. Crear sensores para este dispositivo específico
      for (const s of dev.sensors) {
        // Evitamos duplicar sensores si ya existen en este dispositivo
        const existing = await tx.sensor.findFirst({
          where: { type: s.type, deviceId: device.id }
        });
        
        if (!existing) {
          await tx.sensor.create({
            data: {
              name: s.name,
              type: s.type,
              unit: s.unit,
              deviceId: device.id
            }
          });
        }
      }
    }
    return gateway;
  });
}

// NUEVO: Procesa lecturas de múltiples dispositivos
export async function processGatewayReadingsService(gatewayId, readings, signature) {
  const registrosCreados = [];
  for (const r of readings) {
    console.log("--- DEBUG DE BÚSQUEDA ---");
  console.log("1. Buscando Sensor Type:", `"${r.type}"`);
  console.log("2. En Dispositivo ID:", `"${r.deviceId}"`);
  console.log("3. Para Gateway UUID:", `"${gatewayId}"`);
    // IMPORTANTE: Ahora buscamos el sensor por TYPE y por su DEVICE específico
const sensor = await prisma.sensor.findFirst({
  where: {
    type: r.type,
    device: { 
      deviceId: r.deviceId 
      // Comentamos temporalmente el gatewayId para ver si así lo encuentra
      // gatewayId: gatewayId 
    }
  },
  include: {
    device: true // Esto nos traerá la info del dispositivo para comparar
  }
});

if (sensor) {
  console.log("V SENSOR ENCONTRADO pero...");
  console.log("ID del Gateway en DB:", sensor.device.gatewayId);
  console.log("ID del Gateway en LOG:", gatewayId);
  
  if (sensor.device.gatewayId !== gatewayId) {
    console.log("!!! ALERTA: El dispositivo pertenece a OTRO Gateway !!!");
  }
}

    if (!sensor) {
    console.log("X No se encontró el sensor en la DB");
  } else {
    console.log("V Sensor encontrado ID:", sensor.id);
  }


  if (sensor) {
  // Creamos una huella única para esta lectura específica
  const dataToHash = `${sensor.id}-${r.value}-${new Date().getTime()}-${signature}`;
  const readingHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

  const nuevaLectura = await prisma.reading.create({
    data: {
      value: parseFloat(r.value),
      sensorId: sensor.id,
      hash: readingHash, // <-- AHORA GUARDAMOS EL HASH AQUÍ
      timestamp: new Date()
    }
  });
  registrosCreados.push(nuevaLectura);
}
  }
  return registrosCreados;
}