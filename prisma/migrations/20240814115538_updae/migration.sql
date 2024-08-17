/*
  Warnings:

  - You are about to drop the column `date` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `date_start` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "date",
ADD COLUMN     "date_end" TIMESTAMP,
ADD COLUMN     "date_start" TIMESTAMP NOT NULL;
