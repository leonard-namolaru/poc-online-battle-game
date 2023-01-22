import {Trainer, Battle} from "./entities";

export interface ITrainerRepository {
    create(trainer: { name: string, gender: string }): Promise<Trainer>;

    findAll(): Promise<Trainer[]>
}

export interface IBattleRepository {
    create(battle: { attackingTrainerId: number,
                     opposingTrainerId: number,
                     attackerPokemonLifePoints: number,
                     opponentPokemonLifePoints: number,
                     winner: number }): Promise<Battle>;

    findAll(): Promise<Battle[]>
}