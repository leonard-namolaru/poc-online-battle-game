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
    "attackingTrainerId" INT NOT NULL REFERENCES Trainer,
    "opposingTrainerId" INT NOT NULL REFERENCES Battle,
    "attackerPokemonLifePoints" INT NOT NULL,
    "opponentPokemonLifePoints" INT NOT NULL,
    "winner" INT NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);
