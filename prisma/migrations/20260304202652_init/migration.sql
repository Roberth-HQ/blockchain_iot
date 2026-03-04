/*
  Warnings:

  - You are about to drop the column `firmware` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the `Telemetry` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "BlockchainRecord" ADD COLUMN     "txHash" TEXT;

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "firmware",
DROP COLUMN "isVerified",
DROP COLUMN "lastSeen",
DROP COLUMN "publicKey",
ADD COLUMN     "gatewayId" TEXT;

-- DropTable
DROP TABLE "Telemetry";

-- CreateTable
CREATE TABLE "Gateway" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "firmware" TEXT,
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gateway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT NOT NULL,
    "unit" TEXT,
    "minThreshold" DOUBLE PRECISION,
    "maxThreshold" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reading" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT,
    "sensorId" TEXT NOT NULL,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "Gateway"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockchainRecord" ADD CONSTRAINT "BlockchainRecord_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
