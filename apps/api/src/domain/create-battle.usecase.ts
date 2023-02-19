import { Battle } from "./entities";
import { IBattleRepository } from "./interfaces";

export class CreateBattleUsecase {
    private battleRepository: IBattleRepository;

    constructor(battleRepository: IBattleRepository) {
        this.battleRepository = battleRepository;
    }

    async execute(battle: { attackingTrainerId: number,
                            opposingTrainerId: number,
                            attackerPokemonId : number,
                            opponentPokemonId : number,
                            winner: number }): Promise<Battle> {
        // create a new battle in db
        const newBattle = await this.battleRepository.create({
            attackingTrainerId:  battle.attackingTrainerId,
            opposingTrainerId:  battle.opposingTrainerId,
            attackerPokemonId : battle.attackerPokemonId,
            opponentPokemonId : battle.opponentPokemonId,
            winner:  battle.winner
        });
        return newBattle;
    }
}

