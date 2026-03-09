import crypto from "crypto"

export function buildMerkleRoot(hashes) {

  if (hashes.length === 0) return null

  let layer = hashes

  while (layer.length > 1) {

    const nextLayer = []

    for (let i = 0; i < layer.length; i += 2) {

      const left = layer[i]
      const right = layer[i + 1] || left

      const hash = crypto
        .createHash("sha256")
        .update(left + right)
        .digest("hex")

      nextLayer.push(hash)
    }

    layer = nextLayer
  }

  return layer[0]
}