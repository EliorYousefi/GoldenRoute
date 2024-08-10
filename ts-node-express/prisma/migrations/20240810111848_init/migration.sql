/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "createdAt",
ADD COLUMN     "callsign" TEXT,
ADD COLUMN     "closureTime" DOUBLE PRECISION,
ADD COLUMN     "origin_country" TEXT;
