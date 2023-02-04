import {Trainer, Battle, Pokemon} from "./entities";

export interface ITrainerRepository {
    create(trainer: { name: string, gender: string }): Promise<Trainer>;

    findAll(): Promise<Trainer[]>
    find(trainerId : number) : Promise<Trainer>
    update(trainer:Trainer): Promise<Trainer>
    delete(trainerId : number): Promise<Trainer>
}

export interface IPokemonRepository {
    create(pokemon: {pokedex: number,  name: string, exp:number, level:number}): Promise<Pokemon>;

    findAll(): Promise<Pokemon[]>
    find(pokemonId : number) : Promise<Pokemon>
}

export interface IBattleRepository {
    create(battle: { attackingTrainerId: number,
                     opposingTrainerId: number,
                     attackerPokemonLifePoints: number,
                     opponentPokemonLifePoints: number,
                     winner: number }): Promise<Battle>;

    findAll(): Promise<Battle[]>
    find(battleId: number):  Promise<Battle>
    findActiveBattleWithTrainerId(trainerId: number): Promise<Battle>
    update(battle: Battle): Promise<Battle>
}