import {
    createProjectController,
    getAllProjectsController,
    getProjectByIdController,
    updateProjectController,
    deleteProjectController
}from './proyect.controller.js'

export async function projectRoutes(fastify) {
    fastify.post('/', createProjectController)
    fastify.get('/',getAllProjectsController)
    fastify.get('/:id', getAllProjectsController)
    fastify.put('/:id',updateProjectController)
    fastify.delete('/:id', deleteProjectController)
}