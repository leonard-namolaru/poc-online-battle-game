/*
  Warnings:

  - You are about to drop the column `itemlist` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `trainerId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[statsId]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trainerId]` on the table `PokemonTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Trainer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statsId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Pokemon` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_trainerId_fkey";

-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "statsId" INTEGER NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "itemlist",
DROP COLUMN "trainerId";

-- CreateTable
CREATE TABLE "Item" (
    "itemId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "effect" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Move" (
    "moveId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "damage" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("moveId")
);

-- CreateTable
CREATE TABLE "Stats" (
    "statsId" SERIAL NOT NULL,
    "attack" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("statsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_statsId_key" ON "Pokemon"("statsId");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_itemId_key" ON "Pokemon"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonTeam_trainerId_key" ON "PokemonTeam"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_userId_key" ON "Trainer"("userId");

-- RenameForeignKey
ALTER TABLE "Battle" RENAME CONSTRAINT "Battle_attackingPokemonId_fkey" TO "Battle_attackerPokemonId_fkey";

-- RenameForeignKey
ALTER TABLE "Battle" RENAME CONSTRAINT "Battle_opposingPokemonId_fkey" TO "Battle_opponentPokemonId_fkey";

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("statsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
