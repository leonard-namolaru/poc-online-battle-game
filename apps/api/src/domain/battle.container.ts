import {BattleRepository} from "../infrastructure/battle.repository";
import {CreateBattleUsecase} from "./create-battle.usecase";
import {GetAllBattlesUsecase} from "./get-all-battles.usecase";

export type BattleContainer = {
    createBattleUsecase: CreateBattleUsecase;
    getAllBattlesUsecase: GetAllBattlesUsecase;
}
export const initBattleContainer = (): BattleContainer => {
    const battleRepository = new BattleRepository();
    const createBattleUsecase = new CreateBattleUsecase(battleRepository);
    const getAllBattlesUsecase = new GetAllBattlesUsecase(battleRepository);

    return {
        createBattleUsecase,
        getAllBattlesUsecase
    }
}