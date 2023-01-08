import {TrainerRepository} from "../infrastructure/trainer.repository";
import {CreateTrainerUsecase} from "./create-trainer.usecase";
import {GetAllTrainersUsecase} from "./get-all-trainers.usecase";

export type TrainerContainer = {
    createTrainerUsecase: CreateTrainerUsecase;
    getAllTrainersUsecase: GetAllTrainersUsecase;
}

export const initTrainerContainer = (): TrainerContainer => {
    const trainerRepository = new TrainerRepository();
    const createTrainerUsecase = new CreateTrainerUsecase(trainerRepository);
    const getAllTrainersUsecase = new GetAllTrainersUsecase(trainerRepository);

    return {
        createTrainerUsecase,
        getAllTrainersUsecase
    }
}