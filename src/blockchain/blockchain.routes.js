// src/modules/blockchain/blockchain.routes.js
import { getBlockchainExplorerController } from './blockchain.controller.js'

export default async function blockchainRoutes(fastify) {
  // RUTA: GET /api/blockchain/explorer
  fastify.get('/explorer', getBlockchainExplorerController)
  
  // Si luego quieres buscar un bloque específico por su Hash:
  // fastify.get('/:hash', getBlockByHashController)
}