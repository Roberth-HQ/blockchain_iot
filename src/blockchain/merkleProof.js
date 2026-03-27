export function generateMerkleProof(hashes, index) {

  const proof = []
  let layer = hashes
  let idx = index

  while (layer.length > 1) {

    const nextLayer = []

    for (let i = 0; i < layer.length; i += 2) {

      const left = layer[i]
      const right = layer[i + 1] || left

      if (i === idx || i + 1 === idx) {
        const sibling = i === idx ? right : left
        proof.push(sibling)
        idx = Math.floor(i / 2)
      }

      nextLayer.push(hash(left + right))
    }

    layer = nextLayer
  }

  return proof
}