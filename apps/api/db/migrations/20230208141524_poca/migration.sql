-- CreateTable
CREATE TABLE "Trainer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" SERIAL NOT NULL,
    "attackingTrainerId" INTEGER NOT NULL,
    "opposingTrainerId" INTEGER NOT NULL,
    "attackerPokemonLifePoints" INTEGER NOT NULL,
    "opponentPokemonLifePoints" INTEGER NOT NULL,
    "winner" INTEGER NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "pokedex" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "exp" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pwd" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "inscriptionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemlist" INTEGER,
    "trainerId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonOnPokemonTeams" (
    "pid" INTEGER NOT NULL,
    "pokemonTeamId" INTEGER NOT NULL,

    CONSTRAINT "PokemonOnPokemonTeams_pkey" PRIMARY KEY ("pid","pokemonTeamId")
);

-- CreateTable
CREATE TABLE "PokemonTeam" (
    "teamId" SERIAL NOT NULL,
    "trainerId" INTEGER NOT NULL,

    CONSTRAINT "PokemonTeam_pkey" PRIMARY KEY ("teamId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_pwd_key" ON "User"("email", "pwd");

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_attackingTrainerId_fkey" FOREIGN KEY ("attackingTrainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_opposingTrainerId_fkey" FOREIGN KEY ("opposingTrainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonOnPokemonTeams" ADD CONSTRAINT "PokemonOnPokemonTeams_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonOnPokemonTeams" ADD CONSTRAINT "PokemonOnPokemonTeams_pokemonTeamId_fkey" FOREIGN KEY ("pokemonTeamId") REFERENCES "PokemonTeam"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonTeam" ADD CONSTRAINT "PokemonTeam_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
