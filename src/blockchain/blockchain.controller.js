import * as BlockchainService from './blockchain.service.js'
import prisma from '../../prisma/client.js'

// 2. Controlador para la Verificación de Integridad
export const verifyIntegrityController = async (request, reply) => {
  try {
    const { id } = request.params
    const result = await BlockchainService.verifyBlockIntegrity(id)
    
    return {
      success: true,
      isValid: result.isValid,
      message: result.isValid 
        ? "✅ Bloque Íntegro: Los datos coinciden con el Merkle Root." 
        : "❌ ALERTA: Los datos en la base de datos han sido alterados.",
      details: result.details
    }
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message })
  }
}

// 3. Controlador para crear el Batch
export const createBatchController = async (request, reply) => {
  try {
    const { sensorId } = request.body
    const record = await BlockchainService.createBatchHash(sensorId)
    
    if (!record) {
      return reply.status(400).send({ message: "No hay suficientes lecturas para un bloque (se requieren 10)." })
    }
    
    return record
  } catch (error) {
    reply.status(500).send({ error: error.message })
  }
}

// En blockchain.controller.js
export const getAuditReportController = async (request, reply) => {
  try {
    const { deviceId } = request.params
    const report = await BlockchainService.auditFullChain(deviceId)
    return report
  } catch (error) {
    reply.status(500).send({ error: error.message })
  }
}








export const getBlockchainExplorerController = async (request, reply) => {
  try {
    const { projectId } = request.query;
    console.log("🔍 Buscando bloques para el proyecto:", projectId);

    if (!projectId) {
      return reply.status(400).send({ error: "Falta el projectId" });
    }

    const history = await prisma.blockchainRecord.findMany({
      where: {
        device: {
          location: {
            // El salto correcto es: Record -> Device -> Location -> Project
            projectId: projectId 
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: { 
        device: {
          select: {
            name: true,
            id: true,
            location: { // Opcional: Incluir info de la ubicación
              select: { name: true }
            }
          }
        }
      }
    });

    return history;
  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN EXPLORER:", error);
    reply.status(500).send({ error: error.message });
  }
};