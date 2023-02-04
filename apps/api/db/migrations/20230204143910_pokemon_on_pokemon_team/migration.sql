/*
  Warnings:

  - You are about to drop the column `teamId` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the `_PokemonToPokemonTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PokemonToPokemonTeam" DROP CONSTRAINT "_PokemonToPokemonTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonToPokemonTeam" DROP CONSTRAINT "_PokemonToPokemonTeam_B_fkey";

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "teamId";

-- DropTable
DROP TABLE "_PokemonToPokemonTeam";

-- CreateTable
CREATE TABLE "PokemonOnPokemonTeams" (
    "pid" INTEGER NOT NULL,
    "pokemonTeamId" INTEGER NOT NULL,

    CONSTRAINT "PokemonOnPokemonTeams_pkey" PRIMARY KEY ("pid","pokemonTeamId")
);

-- AddForeignKey
ALTER TABLE "PokemonOnPokemonTeams" ADD CONSTRAINT "PokemonOnPokemonTeams_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonOnPokemonTeams" ADD CONSTRAINT "PokemonOnPokemonTeams_pokemonTeamId_fkey" FOREIGN KEY ("pokemonTeamId") REFERENCES "PokemonTeam"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
