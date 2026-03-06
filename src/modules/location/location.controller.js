import {
    createLocationService,
    getAllLocationsService,
    getLocationByIdService,
    updateLocationService,
    deleteLocationService
} from './location.service.js'

export async function createLocationController(request, reply) {
  try {
    const location = await createLocationService(request.body)
    return reply.status(201).send(location)
  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export async function getAllLocationController() {
  return getAllLocationsService()
} 
//ver como gfunciona el de abajap

// export async function getAllLocationController() {
//     try{
//         const location = await getAllLocationsService()
//         return reply.status(201).send(location)
//     } catch (error){
//         return reply.status(500).send({error:error.message})
//     }
// }

export async function getLocationByIdController(request,reply) {
    try{
        const {id} = request.params
        const location = await getLocationByIdService(id)
        if (!location) return reply.status(404).send({message:'location no encontrada'})
        return reply.status(201).send(location)
    } catch (error){
        return reply.status(500).send({error:error.message})
    }
}

export async function updateLocationController(request,reply) {

    try{
        const {id} = request.params
        const location = await updateLocationService(id,request.body)
        return location
    }catch (error){
        return reply.status(500).send({error: error.message})
    }
}

export async function deleteLocationController(request,reply) {
    try{
        const {id}= request.params
        const location = await deleteLocationService(id,request.body)
        return location
    } catch (error){
        return reply.status(500).send({error: error.message})
    }
    
}