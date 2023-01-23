import {BattleRepository} from "../infrastructure/battle.repository";
import {CreateBattleUsecase} from "./create-battle.usecase";
import {GetAllBattlesUsecase} from "./get-all-battles.usecase";
import {BattleUsecase} from "./battle.usecase";

export type BattleContainer = {
    createBattleUsecase: CreateBattleUsecase;
    getAllBattlesUsecase: GetAllBattlesUsecase;
    battleUsecase: BattleUsecase;
}
export const initBattleContainer = (): BattleContainer => {
    const battleRepository = new BattleRepository();
    const createBattleUsecase = new CreateBattleUsecase(battleRepository);
    const getAllBattlesUsecase = new GetAllBattlesUsecase(battleRepository);
    const battleUsecase = new BattleUsecase(battleRepository);

    return {
        createBattleUsecase,
        getAllBattlesUsecase,
        battleUsecase
    }
}