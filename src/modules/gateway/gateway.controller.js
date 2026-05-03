    import {
    createGatewayService,
    getAllGatewaysService,
    getGatewayByIdService,
    updateGatewayService,
    deactivateGatewayService,
    registerGatewayService,
    processGatewayReadingsService

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
    // 1. Extraemos el filtro de la URL
    const { locationId } = request.query;

    // 2. Llamamos al servicio pasando el locationId (si existe)
    const gateways = await getAllGatewaysService(locationId);
    
    return reply.send(gateways);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
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







    ///////
    export async function registerGatewayController(request, reply) {
  try {
    const gateway = await registerGatewayService(request.body);
    return reply.status(201).send({ message: 'Gateway Auth OK', id: gateway.id });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function receiveDataController(request, reply) {
  try {
    const payload = request.body; // Ejemplo: "{"id":"MAC123","niv":450,"tapa":1,"lat":-16.5...}|FIRMA"
    const [rawData, signature] = payload.split('|');
    const data = JSON.parse(rawData);

    // 1. Verificación de identidad y firma (Lo que hablamos antes)
    const gateway = await getGatewayByIdService(data.id);
    if (!gateway) return reply.status(404).send({ message: 'Gateway no registrado' });

    // 2. Mapeo inteligente de datos
    // Definimos qué llaves del JSON corresponden a qué "type" en la DB
    const mapaSensores = {
      'niv': 'nivel',
      'tapa': 'tapa_reed',
      'lat': 'gps_lat',
      'lng': 'gps_lng'
    };

    const lecturasParaGuardar = [];

    for (const [key, value] of Object.entries(data)) {
      if (mapaSensores[key]) {
        lecturasParaGuardar.push({
          type: mapaSensores[key], // Ej: 'nivel'
          value: value             // Ej: 450
        });
      }
    }

    // 3. Llamamos al servicio para guardar todo el lote (batch)
    const result = await processGatewayReadingsService(gateway.id, lecturasParaGuardar);
    
    return reply.send({ 
      status: 'Procesado', 
      registros: result.length 
    });

  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}