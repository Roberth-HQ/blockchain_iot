import crypto from 'crypto'

export function generateReadingHash(sensorId, value, timestamp) {
  const data = `${sensorId}:${value}:${timestamp}`

  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
}