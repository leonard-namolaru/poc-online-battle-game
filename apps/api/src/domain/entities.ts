export type Nullable<T> = T | null;

export type User = {
    id: number;
    name: string;
    pwd: string;
    email: string;
    inscriptionDate: Date;
    uniqueToken: string;
    isValid: boolean;
    trainer: Nullable<Trainer>;
    allMyPokemon: Pokemon[];
    itemList: Item[];
};

export type Trainer = {
    id: number;
    name: string;
    gender: string;
    activeTeam: PokemonTeam;
};

export type PokemonTeam = {
    teamId: number;
    trainerId: number;
    pokemonList: Pokemon[]; // Max 6 pokemons. Can be empty but cannot battle with it in that case.
};

export type Battle = {
    id: number;
    attackingTrainerId: number;
    opposingTrainerId: number;
    attackerPokemonId : number;
    opponentPokemonId : number;
    winner: number;
};

export type Pokemon = {
    id: number; // Unique ID for every Pokemon in the database
    pokedex: number; // Another ID  to identify the pokemon species (the pokédex number), to identify the pokemon (to display its images, description, etc.)
    name: string;
    stats : Stats;
    item: Item;
    moves: Move[];
    exp:number;
    level:number;
    types:Type[];
};

export type Item = {
    itemId: number;
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

export type Type ={
    name: string;

    /*
    -idea 1
    tableau resist
    tableau weakness
    ->battle 
        -> function check weakness/resist in both tab of foe pokemon
        -> apply final damage
    -idea 2
    big func with if/elseif/else check weakness/resist
    */
       
}