    import {
    createGatewayService,
    getAllGatewaysService,
    getGatewayByIdService,
    updateGatewayService,
    deactivateGatewayService
    } from './gateway.service.js'

    export async function createGatewayController(request, reply) {
    try {
        const { publicKey } = request.body

        if (!publicKey) {
        return reply.status(400).send({
            message: 'publicKey is required'
        })
        }

        const gateway = await createGatewayService(request.body)

        return reply.status(201).send(gateway)

    } catch (error) {
        return reply.status(500).send({ error: error.message })
    }
    }

    export async function getAllGatewaysController(request, reply) {
    try {
        const gateways = await getAllGatewaysService()
        return reply.send(gateways)
    } catch (error) {
        return reply.status(500).send({ error: error.message })
    }
    }

    export async function getGatewayByIdController(request, reply) {
    try {
        const { id } = request.params

        const gateway = await getGatewayByIdService(id)

        if (!gateway) {
        return reply.status(404).send({ message: 'Gateway not found' })
        }

        return reply.send(gateway)

    } catch (error) {
        return reply.status(500).send({ error: error.message })
    }
    }

    export async function updateGatewayController(request, reply) {
    try {
        const { id } = request.params

        const gateway = await updateGatewayService(id, request.body)

        return reply.send(gateway)

    } catch (error) {
        return reply.status(500).send({ error: error.message })
    }
    }

    export async function deactivateGatewayController(request, reply) {
    try {
        const { id } = request.params

        const gateway = await deactivateGatewayService(id)

        return reply.send(gateway)

    } catch (error) {
        return reply.status(500).send({ error: error.message })
    }
    }