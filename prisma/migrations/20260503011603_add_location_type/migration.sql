-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('HOME', 'INDUSTRIAL', 'LOGISTICS');

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "type" "LocationType" NOT NULL DEFAULT 'HOME';
