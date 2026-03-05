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
    return prisma.project.findUnique({
        where:{id}
    })
}

export async function updateProjectService(id, data) {
    return prisma.project.update({
        where: {id},
        data
    })
}

export async function deleteProjectService(id) {
    return prisma.project.delete({
        where: {id}
    })
    
}