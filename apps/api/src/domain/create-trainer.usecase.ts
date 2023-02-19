import { Trainer } from "./entities";
import { ITrainerRepository } from "./interfaces";

export class CreateTrainerUsecase {
    private trainerRepository: ITrainerRepository;

    constructor(trainerRepository: ITrainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    async execute(command: { name: string, gender: string }): Promise<Trainer> {
        // create a new trainer in db
        const newTrainer = await this.trainerRepository.create({
            name: command.name,
            gender: command.gender
        });
        return newTrainer;
    }
}

