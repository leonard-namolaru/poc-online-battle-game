/*
  Warnings:

  - You are about to drop the column `myTrainerId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_myTrainerId_fkey";

-- AlterTable
ALTER TABLE "Pokemon" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "myTrainerId",
ADD COLUMN     "trainerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
