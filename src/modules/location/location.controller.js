import {
  createLocationService,
  getAllLocationsService,
  getLocationByIdService,
  updateLocationService,
  deleteLocationService
} from './location.service.js';

export async function createLocationController(request, reply) {
  try {
    const location = await createLocationService(request.body);
    return reply.status(201).send(location);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getAllLocationController(request, reply) {
  try {
    const { projectId } = request.query; // Captura ?projectId=...
    const locations = await getAllLocationsService(projectId);
    return reply.status(200).send(locations);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getLocationByIdController(request, reply) {
  try {
    const { id } = request.params;
    const location = await getLocationByIdService(id);
    if (!location) return reply.status(404).send({ message: 'Location no encontrada' });
    return reply.status(200).send(location);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function updateLocationController(request, reply) {
  try {
    const { id } = request.params;
    // Limpieza: No permitimos actualizar el ID ni el ProjectId por error
    const { id: _, projectId, ...updateData } = request.body;
    
    const location = await updateLocationService(id, updateData);
    return reply.status(200).send(location);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function deleteLocationController(request, reply) {
  try {
    const { id } = request.params;
    const location = await deleteLocationService(id);
    return reply.status(200).send(location);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}