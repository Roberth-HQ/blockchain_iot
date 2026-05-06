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

    import { createVerify } from 'node:crypto';

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
    // Llamamos al servicio para crear el registro en la DB
    const gateway = await registerGatewayService(request.body);

    // Preparamos la respuesta enriquecida para el ESP32
    return reply.status(201).send({ 
      message: 'Gateway Auth OK', 
      // Este objeto 'config' es el que el ESP32 guardará en la SD
      config: {
        gatewayId: gateway.id,
        gatewayMac: gateway.gatewayMac,
        locationId: gateway.locationId,
        serverEndpoint: "/gateways/data", // Para que el ESP32 sepa a dónde enviar datos
        registeredAt: new Date().toISOString(),
        status: "ACTIVE"
      }
    });
  } catch (error) {
    console.error("Error en Registro:", error.message);
    return reply.status(500).send({ error: error.message });
  }
}

export async function receiveDataController(request, reply) {
  try {
    // 1. SEPARAR JSON DE LA FIRMA
    const payload = request.body; 
    if (!payload || !payload.includes('|')) {
      return reply.status(400).send({ message: 'Formato inválido. Se espera DATA|FIRMA' });
    }

    const [rawData, signature] = payload.split('|');
    const data = JSON.parse(rawData); 

    // 2. BUSCAR GATEWAY EN DB
    const gateway = await prisma.gateway.findFirst({
      where: { gatewayMac: data.gatewayMac }
    });

    if (!gateway) return reply.status(404).send({ message: 'Gateway no registrado' });

    // REGLA DE ESTADO: Solo ACTIVE permite procesar
    if (gateway.status !== 'ACTIVE') {
      return reply.status(403).send({ message: 'Acceso denegado. Gateway no activo.' });
    }

    // 3. VERIFICACIÓN DE FIRMA (ESTRATEGIA BUFFER)
    try {
      // Limpiamos la clave de cualquier espacio, salto de línea o encabezado basura
      const cleanKeyBase64 = gateway.publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s+/g, ''); 

      const verifier = createVerify('sha256');
      verifier.update(rawData);
      verifier.end();

      /**
       * Usamos un objeto de configuración en lugar de un string PEM.
       * Esto es mucho más robusto para OpenSSL en Node.js.
       */
      const publicKeyObject = {
        key: Buffer.from(cleanKeyBase64, 'base64'),
        format: 'der', // Binary format
        type: 'spki'   // Subject Public Key Info
      };

      const isValid = verifier.verify(publicKeyObject, signature, 'hex');

      if (!isValid) {
        console.warn(`[VALIDACIÓN] Firma fallida para: ${data.gatewayMac}`);
        return reply.status(401).send({ message: 'Firma digital inválida.' });
      }

      console.log(`[OK] Firma verificada para: ${data.gatewayMac}`);

    } catch (cryptoError) {
      console.error("--- ERROR EN VERIFICACIÓN CRIPTOGRÁFICA ---");
      console.error("Detalle:", cryptoError.message);
      
      // Si la firma falla por formato, mostramos qué llegó a la DB
      console.log("Contenido publicKey en DB:", gateway.publicKey);

      return reply.status(500).send({ 
        error: "Error de formato en Clave Pública.",
        detail: cryptoError.message 
      });
    }

    // 4. MAPEO DINÁMICO DE DISPOSITIVOS Y SENSORES
    const lecturasParaGuardar = [];
    for (const dev of data.devices) {
      const currentDeviceId = dev.deviceId;
      for (const [key, value] of Object.entries(dev)) {
        if (key === 'deviceId') continue; // Saltamos el ID del nodo

        lecturasParaGuardar.push({
          deviceId: currentDeviceId,
          type: key,
          value: value
        });
      }
    }

    // 5. GUARDADO EN DB Y GENERACIÓN DE HASHES POR FILA
    const result = await processGatewayReadingsService(gateway.id, lecturasParaGuardar, signature);
    
    return reply.send({ 
      status: 'Autenticado y Procesado', 
      totalReadings: result.length 
    });

  } catch (error) {
    console.error("ERROR CRÍTICO EN CONTROLADOR:", error);
    return reply.status(500).send({ error: error.message });
  }
}