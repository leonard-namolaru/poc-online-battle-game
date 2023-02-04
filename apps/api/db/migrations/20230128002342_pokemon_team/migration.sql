/*
  Warnings:

  - Added the required column `teamId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PokemonTeam" (
    "teamId" SERIAL NOT NULL,
    "trainerId" INTEGER NOT NULL,

    CONSTRAINT "PokemonTeam_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "_PokemonToPokemonTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonToPokemonTeam_AB_unique" ON "_PokemonToPokemonTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonToPokemonTeam_B_index" ON "_PokemonToPokemonTeam"("B");

-- AddForeignKey
ALTER TABLE "PokemonTeam" ADD CONSTRAINT "PokemonTeam_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonTeam" ADD CONSTRAINT "_PokemonToPokemonTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonTeam" ADD CONSTRAINT "_PokemonToPokemonTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonTeam"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;
