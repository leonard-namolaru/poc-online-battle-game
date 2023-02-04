-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "pokedex" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "exp" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);
