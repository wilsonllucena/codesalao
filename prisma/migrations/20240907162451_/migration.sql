/*
  Warnings:

  - You are about to drop the column `userId` on the `companies` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "userId",
ADD COLUMN     "publicId" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
