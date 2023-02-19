import { Battle } from "./entities";
import { IBattleRepository } from "./interfaces";

export class BattleUsecase {
    private battleRepository: IBattleRepository;

    constructor(battleRepository: IBattleRepository) {
        this.battleRepository = battleRepository;
    }

    async doDammage(attack: { attackedTrainerId: number,
                            dammage: number }): Promise<Battle> {
        // do dammage to the trainer with attackedTrainerId
        let battle = await this.battleRepository.findActiveBattleWithTrainerId(attack.attackedTrainerId);
        // Case where battle is already finished.
        if (battle.winner != -1){
            return Promise.reject("Battle as ended. No dammage can be done anymore.");
        }
        if (battle.attackingTrainerId === attack.attackedTrainerId){
            battle.attackerPokemonLifePoints -= attack.dammage;
        }else{
            battle.opponentPokemonLifePoints -= attack.dammage;
        }
        // Victory check
        if (battle.attackerPokemonLifePoints <= 0){
            battle.winner = battle.opposingTrainerId;
        }else if (battle.opponentPokemonLifePoints <= 0){
            battle.winner = battle.attackingTrainerId;
        }
        //TODO: handle promise rejection ?
        this.battleRepository.update(battle);
        return battle
    }
}

