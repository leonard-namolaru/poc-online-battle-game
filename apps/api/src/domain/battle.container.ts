import {BattleRepository} from "../infrastructure/battle.repository";
import {CreateBattleUsecase} from "./create-battle.usecase";
import {GetAllBattlesUsecase} from "./get-all-battles.usecase";
import {BattleUsecase} from "./battle.usecase";
import { TrainerRepository } from "../infrastructure/trainer.repository";
import {PokemonTeamRepository} from "../infrastructure/pokemon-team.repository";

export type BattleContainer = {
    createBattleUsecase: CreateBattleUsecase;
    getAllBattlesUsecase: GetAllBattlesUsecase;
    battleUsecase: BattleUsecase;
}
export const initBattleContainer = (): BattleContainer => {
    const battleRepository = new BattleRepository();
    const trainerRepository = new TrainerRepository();
    const pokemonTeamRepository = new PokemonTeamRepository();

    const createBattleUsecase = new CreateBattleUsecase(battleRepository);
    const getAllBattlesUsecase = new GetAllBattlesUsecase(battleRepository);
    const battleUsecase = new BattleUsecase(battleRepository,trainerRepository, pokemonTeamRepository);

    return {
        createBattleUsecase,
        getAllBattlesUsecase,
        battleUsecase
    }
}