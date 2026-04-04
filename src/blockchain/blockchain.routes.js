// src/modules/blockchain/blockchain.routes.js
import { 
  getBlockchainExplorerController, 
  verifyIntegrityController,
  createBatchController,
  getAuditReportController
} from './blockchain.controller.js'

export default async function blockchainRoutes(fastify) {
  
  // 1. EL EXPLORADOR (Lo que ya tenías)
  // GET /api/blockchain/explorer
  fastify.get('/explorer', getBlockchainExplorerController)

  // 2. EL BOTÓN DE VERIFICACIÓN (Punto 1 y 5)
  // GET /api/blockchain/verify/:id
  fastify.get('/verify/:id', verifyIntegrityController)

  // Auditoría de TODA LA CADENA (Estatus del dispositivo)
  fastify.get('/audit/:deviceId', getAuditReportController)

  // 3. CREACIÓN DE BATCH (Para procesar las 10 lecturas)
  // POST /api/blockchain/batch
  fastify.post('/batch', createBatchController)
}