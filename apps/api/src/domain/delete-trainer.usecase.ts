import { Trainer } from "./entities";
import { ITrainerRepository } from "./interfaces";

export class DeleteTrainerUsecase {
  private trainerRepository: ITrainerRepository;

  constructor(trainerRepository: ITrainerRepository) {
    this.trainerRepository = trainerRepository;
  }

  async execute(command: { id: number }): Promise<Trainer> {
    // delete a  trainer in db
    const DeletedTrainer = await this.trainerRepository.delete(command.id);
    return DeletedTrainer;
  }
}
