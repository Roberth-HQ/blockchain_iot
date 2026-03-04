// src/gateway/gateway.controller.js
import GatewayService from './gateway.service.js';

export const receiveData = async (request, reply) => {
    try {
        const result = GatewayService.processIncomingData(request.body);
        return reply.code(200).send(result);
    } catch (err) {
        return reply.code(400).send({ error: err.message });
    }
};

export const registerDevice = async (request, reply) => {
    const { deviceId, publicKey } = request.body;

    const result = GatewayService.registerDevice(deviceId, publicKey);
    return reply.send(result);
};
