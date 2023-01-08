import { Trainer } from "./entities";
import { ITrainerRepository } from "./interfaces";

export class GetAllTrainersUsecase {
    private trainerRepository: ITrainerRepository;

    constructor(trainerRepository: ITrainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    async execute(): Promise<Trainer[]> {
        // return all trainers in db
        const trainers = await this.trainerRepository.findAll();
        return trainers;
    }
}
