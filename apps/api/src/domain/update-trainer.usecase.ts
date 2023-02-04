import { Trainer} from "./entities";
import { ITrainerRepository } from "./interfaces";

export class UpdateTrainerUsecase {
    private trainerRepository: ITrainerRepository;

    constructor(trainerRepository: ITrainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    async execute(command: { id:number ,name: string, gender: string }): Promise<Trainer> {
        // update an trainer in db
        const newTrainer = await this.trainerRepository.update({
            id: command.id,
            name: command.name,
            gender: command.gender,
        });
        return newTrainer;
    }
}

