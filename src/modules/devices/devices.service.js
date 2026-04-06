import prisma from '../../../prisma/client.js'

export async function createDeviceService({ deviceId, name, gatewayId, locationId }) {
  return prisma.device.create({
    data: {
      deviceId,
      name: name || null,
      gatewayId: gatewayId || null,
      locationId: locationId || null,
      status: 'PENDING'
    }
  })
}

export async function getAllDevicesService() {
  return prisma.device.findMany({
    include: {
      gateway: true,
      sensors: true
    }
  })
}

export async function getDeviceByIdService(id) {
  return prisma.device.findUnique({
    where: { id },
    include: {
      gateway: true,
      sensors: true
    }
  })
}

export async function revokeDeviceService(id) {
  return prisma.device.update({
    where: { id },
    data: {
      status: 'REVOKED'
    }
  })
}

export async function connectDeviceService(deviceId, publicKey) {
  // 1. Buscamos si el administrador ya creó el registro (en PENDING)
  const device = await prisma.device.findUnique({
    where: { deviceId }
  });

  if (!device) {
    throw new Error("El dispositivo no está registrado en el sistema.");
  }

  // 2. Si el dispositivo ya está ACTIVE y tiene una publicKey diferente, 
  // podría ser un intento de suplantación.
  if (device.status === 'ACTIVE' && device.publicKey !== publicKey) {
    throw new Error("Conflicto de seguridad: La clave pública no coincide.");
  }

  // 3. Actualizamos a ACTIVE y guardamos la llave pública
  return prisma.device.update({
    where: { deviceId },
    data: {
      publicKey: publicKey,
      status: 'ACTIVE',
      lastSeen: new Date()
    }
  });
}


export async function activateDeviceService(id) {
  return prisma.device.update({
    where: { id },
    data: { status: 'ACTIVE' } // O 'PENDING' según tu lógica
  })
}

export async function updateDeviceService(id, data) {
  return prisma.device.update({
    where: { id },
    data // Aquí pasamos los campos que queremos actualizar
  })
}

export async function deleteDeviceService(id) {
  return prisma.device.delete({
    where: { id }
  })
}

export async function getDeviceConfigService(id) {
  return prisma.device.findUnique({
    where: { id: id },
    include: {
      sensors: true,
      location: {
        include: {
          project: true // Para obtener el ID del proyecto al que pertenece
        }
      }
    }
  });
}