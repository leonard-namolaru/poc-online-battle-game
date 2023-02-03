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
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "effect" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_itemId_key" ON "Pokemon"("itemId");

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_attackingTrainerId_fkey" FOREIGN KEY ("attackingTrainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_opposingTrainerId_fkey" FOREIGN KEY ("opposingTrainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
