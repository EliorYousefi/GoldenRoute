-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "uavLocationLat" DOUBLE PRECISION NOT NULL,
    "uavLocationLng" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "planeLocationLat" DOUBLE PRECISION NOT NULL,
    "planeLocationLng" DOUBLE PRECISION NOT NULL,
    "callsign" TEXT,
    "origin_country" TEXT,
    "closureTime" DOUBLE PRECISION,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);
