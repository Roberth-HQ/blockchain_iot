import prisma from '../../../prisma/client.js'

export async function createProjectService({name,description}) {
    return prisma.project.create({
        data: {
            name,
            description: description || null
        }
    })
}

export async function getAllProjectsService() {
    return prisma.project.findMany()
}

export async function getProjectByIdServices(id) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      locations: {
        include: {
          devices: {
            include: {
              sensors: true // Esto es lo que nos permite contar todo
            }
          }
        }
      }
    }
  });
}

export async function updateProjectService(id, data) {
    return prisma.project.update({
        where: {id},
        data: data
    })
}

export async function deleteProjectService(id) {
    // 1. Verificar si existe
    const exists = await prisma.project.findUnique({ where: { id } });
    if (!exists) throw new Error("El proyecto no existe");

    // 2. Borrar (Ojo: fallará si tiene Locations vinculadas)
    return prisma.project.delete({
        where: { id }
    });
}