import crypto from 'crypto'

export function generateReadingHash(sensorId, value, timestamp) {
  const data = `${sensorId}:${value}:${timestamp}`

  console.log("hash creadno oh yea")
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
}