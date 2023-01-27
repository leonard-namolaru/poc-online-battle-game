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
    id: number; // Unique ID for every Pokemon in the database
    pokedex: number; // Another ID  to identify the pokemon species (the pokédex number), to identify the pokemon (to display its images, description, etc.)
    name: string;
    stats? : Stats;
    item?: Item;
    moves?: Move[];
    exp:number;
    level:number;
};

export type Item = {
    id: number;
    name: string;
    effect: number;
};

export type Move = {
    name: string;
    damage: number;
};

export type Stats = {
    attack: number;
    hp: number;
};