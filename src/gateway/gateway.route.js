// src/gateway/gateway.route.js
import { receiveData, registerDevice } from './gateway.controller.js';

async function gatewayRoutes(fastify, options) {
    
    // Registrar dispositivo en la lista blanca
    fastify.post('/gateway/register', registerDevice);

    // Endpoint donde IoT envía sus datos
    fastify.post('/gateway/data', receiveData);

}

export default gatewayRoutes;
