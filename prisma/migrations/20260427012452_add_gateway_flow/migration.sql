/*
  Warnings:

  - You are about to drop the column `firmware` on the `Gateway` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gatewayMac]` on the table `Gateway` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gatewayMac` to the `Gateway` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gateway" DROP CONSTRAINT "Gateway_locationId_fkey";

-- AlterTable
ALTER TABLE "Gateway" DROP COLUMN "firmware",
ADD COLUMN     "gatewayMac" TEXT NOT NULL,
ADD COLUMN     "status" "DeviceStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "locationId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gateway_gatewayMac_key" ON "Gateway"("gatewayMac");

-- AddForeignKey
ALTER TABLE "Gateway" ADD CONSTRAINT "Gateway_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
