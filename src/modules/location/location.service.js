import prisma from '../../../prisma/client.js';

export async function createLocationService({ name, address, projectId ,type}) {
  return prisma.location.create({
    data: {
      name,
      address: address || null,
      projectId,
      type: type || 'HOME'
    }
  });
}

export async function getAllLocationsService(projectId = null) {
  // Si llega projectId, filtra. Si no, trae todos.
  return prisma.location.findMany({
    where: projectId ? { projectId } : {}
  });
}

export async function getLocationByIdService(id) {
  return prisma.location.findUnique({
    where: { id }
  });
}

export async function updateLocationService(id, data) {
  return prisma.location.update({
    where: { id },
    data
  });
}

export async function deleteLocationService(id) {
  return prisma.location.delete({
    where: { id }
  });
}