import crypto from "crypto"

function hash(data) {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
}

export function buildMerkleRoot(hashes) {

  if (hashes.length === 0) return null

  let level = hashes

  while (level.length > 1) {

    const nextLevel = []

    for (let i = 0; i < level.length; i += 2) {

      if (i + 1 < level.length) {
        nextLevel.push(hash(level[i] + level[i + 1]))
      } else {
        nextLevel.push(hash(level[i] + level[i]))
      }

    }

    level = nextLevel
  }

  return level[0]
}