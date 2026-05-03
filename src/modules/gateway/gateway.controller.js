    import prisma from '../../../prisma/client.js'
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
    // 1. Separar el JSON de la Firma
    const payload = request.body; 
    if (!payload.includes('|')) {
      return reply.status(400).send({ message: 'Formato inválido. Se espera DATA|FIRMA' });
    }

    const [rawData, signature] = payload.split('|');
    const data = JSON.parse(rawData); 

    /* ESTRUCTURA QUE VIENE EN data:
      {
        "gatewayMac": "24:0A:C4:00:01:10",
        "devices": [
          {
            "deviceId": "NODO-TANQUE",
            "nivel": 450,
            "temperatura": 25
          },
          {
            "deviceId": "NODO-GPS",
            "lat": -16.5,
            "lng": -68.1
          }
        ]
      }
    */

    // 2. Identificar al Gateway por su MAC (o ID si prefieres enviarlo)
    // Buscamos el gateway en la DB para obtener su llave pública y verificar la firma
    const gateway = await prisma.gateway.findFirst({
      where: { gatewayMac: data.gatewayMac }
    });

    if (!gateway) {
      return reply.status(404).send({ message: 'Gateway no registrado' });
    }

    // --- AQUÍ VALIDARÍAS LA FIRMA CON gateway.publicKey ---
    // const isValid = verify(rawData, signature, gateway.publicKey);
    // if (!isValid) return reply.status(401).send({ message: 'Firma no válida' });

    const lecturasParaGuardar = [];

    // 3. Mapeo Dinámico: No importa qué sensor mandes, si existe en la DB, se guarda
    for (const dev of data.devices) {
      const currentDeviceId = dev.deviceId;

      for (const [key, value] of Object.entries(dev)) {
        // Saltamos 'deviceId' porque no es un valor de sensor
        if (key === 'deviceId') continue;

        lecturasParaGuardar.push({
          deviceId: currentDeviceId, // "NODO-TANQUE"
          type: key,                // "nivel"
          value: value               // 450
        });
      }
    }

    // 4. Llamamos al servicio para guardar todo
    const result = await processGatewayReadingsService(gateway.id, lecturasParaGuardar, signature);
    
    return reply.send({ 
      status: 'Procesado', 
      totalReadings: result.length 
    });

  } catch (error) {
  console.error("ERROR DETECTADO:", error); // Esto imprimirá la línea exacta en la terminal
  return reply.status(500).send({ 
    error: error.message, 
    stack: error.stack // Esto te dirá el archivo y línea del error
  });
}
}