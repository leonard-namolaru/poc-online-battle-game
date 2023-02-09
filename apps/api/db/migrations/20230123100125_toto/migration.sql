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

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_attackingTrainerId_fkey" FOREIGN KEY ("attackingTrainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_opposingTrainerId_fkey" FOREIGN KEY ("opposingTrainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
