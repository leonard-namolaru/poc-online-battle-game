import { Battle } from "./entities";
import { IBattleRepository } from "./interfaces";

export class CreateBattleUsecase {
    private battleRepository: IBattleRepository;

    constructor(battleRepository: IBattleRepository) {
        this.battleRepository = battleRepository;
    }

    async execute(battle: { attackingTrainerId: number,
                            opposingTrainerId: number,
                            attackerPokemonLifePoints: number,
                            opponentPokemonLifePoints: number,
                            winner: number }): Promise<Battle> {
        // create a new battle in db
        const newBattle = await this.battleRepository.create({
            attackingTrainerId:  battle.attackingTrainerId,
            opposingTrainerId:  battle.opposingTrainerId,
            attackerPokemonLifePoints:  battle.attackerPokemonLifePoints,
            opponentPokemonLifePoints:  battle.opponentPokemonLifePoints,
            winner:  battle.winner
        });
        return newBattle;
    }
}

