/*
  Warnings:

  - You are about to drop the column `hash` on the `BlockchainRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicKey]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BlockchainRecord" DROP COLUMN "hash",
ADD COLUMN     "blockHash" TEXT,
ADD COLUMN     "merkleRoot" TEXT;

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "publicKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Device_publicKey_key" ON "Device"("publicKey");
