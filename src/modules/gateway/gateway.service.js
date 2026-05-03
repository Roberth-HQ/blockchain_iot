import prisma from '../../../prisma/client.js'

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
// NUEVO: Registro inicial del Gateway con sus sensores
export async function registerGatewayService({ gatewayMac, publicKey, locationId, sensors }) {
  return prisma.$transaction(async (tx) => {
    // 1. Buscamos si ya existe un Gateway con esa MAC
    let gateway = await tx.gateway.findFirst({
      where: { gatewayMac: gatewayMac } // Campo único que definimos en el esquema
    });

    if (gateway) {
      // Si existe, actualizamos la llave y la última vez visto
      gateway = await tx.gateway.update({
        where: { id: gateway.id },
        data: { publicKey, lastSeen: new Date() }
      });
    } else {
      // Si no existe, lo creamos con un ID automático (UUID)
      gateway = await tx.gateway.create({
        data: {
          gatewayMac: gatewayMac, // Guardamos la MAC como referencia única
          name: `Gateway Cisterna ${gatewayMac.slice(-5)}`, // Nombre amigable
          publicKey: publicKey,
          locationId: locationId
        }
      });
    }

    // 2. Crear o actualizar el Dispositivo vinculado
    // Usamos upsert para evitar duplicados si el proceso se repite
    const device = await tx.device.upsert({
      where: { deviceId: `DEV-${gatewayMac}` },
      update: { status: 'ACTIVE', lastSeen: new Date() },
      create: {
        deviceId: `DEV-${gatewayMac}`,
        name: `Módulo Sensores`,
        gatewayId: gateway.id,
        locationId: locationId,
        status: 'ACTIVE'
      }
    });

    // 3. Crear los sensores (solo si el dispositivo es nuevo o no los tiene)
    const existingSensors = await tx.sensor.findMany({ where: { deviceId: device.id } });
    
    if (existingSensors.length === 0) {
      for (const s of sensors) {
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

    return gateway;
  });
}

// NUEVO: Guardar lecturas firmadas
export async function processGatewayReadingsService(gatewayId, readings) {
  const registrosCreados = [];

  for (const r of readings) {
    // Buscamos el sensor que coincida con el TYPE y que pertenezca a este GATEWAY
    const sensor = await prisma.sensor.findFirst({
      where: {
        type: r.type,
        device: { gatewayId: gatewayId }
      }
    });

    if (sensor) {
      const nuevaLectura = await prisma.reading.create({
        data: {
          value: parseFloat(r.value),
          sensorId: sensor.id,
          timestamp: new Date() // El servidor pone la hora de llegada
        }
      });
      registrosCreados.push(nuevaLectura);
    }
  }
  return registrosCreados;
}