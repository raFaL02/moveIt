/*
  Warnings:

  - The primary key for the `Driver` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Driver` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `duration` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `driverId` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_driverId_fkey";

-- AlterTable
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Driver_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "duration" TEXT NOT NULL,
DROP COLUMN "driverId",
ADD COLUMN     "driverId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
