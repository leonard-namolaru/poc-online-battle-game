import { Battle } from "../entities";
import { IBattleRepository } from "../interfaces";

export class GetAllBattlesUsecase {
    private battleRepository: IBattleRepository;

    constructor(battleRepository: IBattleRepository) {
        this.battleRepository = battleRepository;
    }

    async execute(): Promise<Battle[]> {
        // return all battles in db
        const battles = await this.battleRepository.findAll();
        return battles;
    }
}
