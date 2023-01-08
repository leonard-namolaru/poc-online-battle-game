import {Trainer} from "./entities";

export interface ITrainerRepository {
    create(trainer: { name: string, gender: string }): Promise<Trainer>;

    findAll(): Promise<Trainer[]>
}