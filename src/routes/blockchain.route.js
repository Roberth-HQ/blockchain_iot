//import Blockchain from "../blockchain/blockchain.js";
import Blockchain from "../blockchain/blockchain.js";

export default async function blockchainRoutes(fastify, opts) {
  const chain = new Blockchain();

  // GET full chain
  fastify.get("/blockchain", async () => {
    return {
      chain: chain.chain,
      valid: chain.isValid(),
    };
  });

  // Add block
  fastify.post("/blockchain/add", async (request, reply) => {
    const data = request.body;
    const newBlock = chain.addBlock(data);
    return { message: "Block added", block: newBlock };
  });
}
