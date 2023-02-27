import {BattleRepository} from "../infrastructure/battle.repository";
import {CreateBattleUsecase} from "./create-battle.usecase";
import {GetAllBattlesUsecase} from "./get-all-battles.usecase";
import {BattleUsecase} from "./battle.usecase";
import { TrainerRepository } from "../infrastructure/trainer.repository";

export type BattleContainer = {
    createBattleUsecase: CreateBattleUsecase;
    getAllBattlesUsecase: GetAllBattlesUsecase;
    battleUsecase: BattleUsecase;
}
export const initBattleContainer = (): BattleContainer => {
    const battleRepository = new BattleRepository();
    const trainerRepository = new TrainerRepository();

    const createBattleUsecase = new CreateBattleUsecase(battleRepository);
    const getAllBattlesUsecase = new GetAllBattlesUsecase(battleRepository);
    const battleUsecase = new BattleUsecase(battleRepository,trainerRepository);

    return {
        createBattleUsecase,
        getAllBattlesUsecase,
        battleUsecase
    }
}