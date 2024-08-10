/*
  Warnings:

  - You are about to drop the column `lat` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Location` table. All the data in the column will be lost.
  - Added the required column `planeLocationLat` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planeLocationLng` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `radius` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speed` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uavLocationLat` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uavLocationLng` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "lat",
DROP COLUMN "lng",
ADD COLUMN     "planeLocationLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "planeLocationLng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "radius" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "speed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "uavLocationLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "uavLocationLng" DOUBLE PRECISION NOT NULL;
