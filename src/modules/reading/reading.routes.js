import {
  createReadingController,
  getAllReadingsController,
  getReadingByIdController,
  deleteReadingController
} from './reading.controller.js'

export default async function readingRoutes(fastify) {
  fastify.post('/', createReadingController)
  fastify.get('/', getAllReadingsController)
  fastify.get('/:id', getReadingByIdController)
  fastify.delete('/:id', deleteReadingController)
}