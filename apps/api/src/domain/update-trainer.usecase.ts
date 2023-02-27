import {Trainer} from "./entities";
import { ITrainerRepository } from "./interfaces";

export class UpdateTrainerUsecase {
    private trainerRepository: ITrainerRepository;

    constructor(trainerRepository: ITrainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    async execute(command: { gender: string, name: string, id: number}): Promise<Trainer> {
        // update a trainer in db
        const newTrainer = await this.trainerRepository.update({
            id: command.id,
            name: command.name,
            gender: command.gender
        });
        return newTrainer;
    }
}

