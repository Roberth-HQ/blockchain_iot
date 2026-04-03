import prisma from '../../prisma/client.js'

export async function getBlockchainExplorerController(request, reply) {
  // Fastify extrae lo que viene después del '?' en la URL
  const { projectId } = request.query; 

  try {
    const blocks = await prisma.blockchainRecord.findMany({
      where: {
        // FILTRADO ANIDADO:
        device: {
          location: {
            projectId: projectId // <--- Solo registros de este proyecto
          }
        }
      },
      include: {
        device: {
          select: { name: true, deviceId: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return blocks;
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Error al filtrar la cadena' });
  }
}