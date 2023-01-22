export type Trainer = {
    id: number;
    name: string;
    gender: string;
};

export type Battle = {
    id: number;
    attackingTrainerId: number;
    opposingTrainerId: number;
    attackerPokemonLifePoints: number;
    opponentPokemonLifePoints: number;
    winner: number;
};

export type Pokemon = {
    id: number;
    name: string;

    //stats: Stats;
    //item: Item
    //moves: Move[]
    exp:number
    level:number
};