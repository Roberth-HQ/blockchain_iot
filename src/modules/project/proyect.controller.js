import{
    createProjectService,
    getAllProjectsService,
    getProjectByIdServices,
    updateProjectService,
    deleteProjectService
} from './proyect.service.js'

export async function createProjectController(request, reply) {
    try{
        const project = await createProjectService(request.body)
        return reply.status(201).send(project)
    }catch (error){
        return reply.status(500).send({error: error.message})
    }
}

export async function getAllProjectsController() {
    return getAllProjectsService()
}

export async function getProjectByIdController(request,reply) {
    try{
        const {id}= request.params
        const project = await getProjectByIdServices(id)
        if (!project) return reply.status(404).send({ message:'proyecto no encontrado' })
        return project
    }catch (error){
        return reply.status(500).send({ error:error.message })
    }
}

export async function updateProjectController(request,reply) {
    try{
        const {id} = request.params
        const data = request.body;
        const project = await updateProjectService(id,data)
        return project
    } catch (error){
        return reply.status(500).send({error: error.message})
    }
}

export async function deleteProjectController(request, reply) {
    try{
        const {id} = request.params
        const project = await deleteProjectService(id)
        return project
    }catch (error){
        return reply.status(500).send({error: error.message})
    }
}