import {
    createLocationController,
    getAllLocationController,
    getLocationByIdController,
    updateLocationController,
    deleteLocationController
} from './location.controller.js'

export async function locationRoutes(fastify) {
    fastify.post('/', createLocationController)
    fastify.get('/',getAllLocationController)
    fastify.get('/:id',getLocationByIdController)
    fastify.put('/:id', updateLocationController)
    fastify.delete('/:id', deleteLocationController)
    
}