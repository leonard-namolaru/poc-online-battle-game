import {Battle, Trainer} from "./entities";
import {IBattleRepository, ITrainerRepository} from "./interfaces";
import {hpPointsPokemonsDuringBattle} from "../server"
export class BattleUsecase {
    private battleRepository: IBattleRepository;
    private trainerRepository : ITrainerRepository;

    constructor(battleRepository : IBattleRepository, trainerRepository : ITrainerRepository) {
        this.battleRepository = battleRepository;
        this.trainerRepository = trainerRepository;
    }

    async doDammage(attack: { attackedTrainerId: number, dammage: number }): Promise<Battle> {
        // Inflicting damage to the pokemon currently represented by the trainer with the ID attackedTrainerId

        // The first step is to find the battle in question
        let battle : Battle;
        try {
            battle = await this.battleRepository.findActiveBattleWithTrainerId(attack.attackedTrainerId);
        } catch (e) {  // If the battle does not exist or is already over
            return Promise.reject(e);
        }

        // We are looking for the attacked trainer
        let attackedTrainer : Trainer;
        try {
            attackedTrainer = await this.trainerRepository.find(attack.attackedTrainerId);
        } catch (e) {
            return Promise.reject("The attacked trainer was not found.");
        }

        if (attackedTrainer.activeTeam!.pokemonList!.length == 0)
            return Promise.reject("The team of the attacked trainer is empty.");

        const attackedTrainerTeam = attackedTrainer.activeTeam!.pokemonList;

        let attackedPokemonId : number;
        if(attackedTrainer.id === battle.opposingTrainerId){
            attackedPokemonId = battle.opponentPokemonId;
        }else{
            attackedPokemonId = battle.attackerPokemonId;
        }

        // We go through the Pokemon list of the attacked trainer
        for(let i = 0 ; i < attackedTrainerTeam.length ; i++){
            // If it's the pokemon that currently represents the trainer being attacked in battle
            if (attackedTrainerTeam[i].id === attackedPokemonId) {

                let indexAttackedPokemonInMemory = -1;
                for (let j = 0 ; j < hpPointsPokemonsDuringBattle.length ; j++) {
                    if (hpPointsPokemonsDuringBattle[j].pokemonId == attackedPokemonId) {
                        indexAttackedPokemonInMemory = j;
                        attackedTrainerTeam[i].stats = {attack: 0, hp: hpPointsPokemonsDuringBattle[indexAttackedPokemonInMemory].hp};
                        break;
                    }
                }

                if (indexAttackedPokemonInMemory == -1) {
                    hpPointsPokemonsDuringBattle.push({pokemonId : attackedTrainerTeam[i].id , hp : attackedTrainerTeam[i].stats.hp});
                    indexAttackedPokemonInMemory = hpPointsPokemonsDuringBattle.length - 1;
                }

                attackedTrainerTeam[i].stats.hp -= attack.dammage;
                hpPointsPokemonsDuringBattle[indexAttackedPokemonInMemory].hp  = attackedTrainerTeam[i].stats.hp;

                if (attackedTrainerTeam[i].stats.hp <= 0) {
                    // If the pokemon attacked is a pokemon of the trainer who started the battle
                    // and if we haven't reached the last Pokemon in the team
                    if (attackedTrainerTeam[i].id === battle.attackerPokemonId && i < attackedTrainerTeam.length - 1)
                        battle.attackerPokemonId = attackedTrainerTeam[i+1].id; // We move on to the next Pokemon in the team
                    else if (attackedTrainerTeam[i].id === battle.opponentPokemonId && i < attackedTrainerTeam.length - 1)
                        battle.opponentPokemonId = attackedTrainerTeam[i+1].id;

                    // The Pokemon has no life points so we remove it from hpPointsPokemonsDuringBattle
                    hpPointsPokemonsDuringBattle.splice(indexAttackedPokemonInMemory,1);

                    // If the attacked trainer has no more pokemons with life points
                    if (i == attackedTrainerTeam.length - 1) {
                        if(attackedTrainer.id === battle.opposingTrainerId){
                            battle.winner = battle.attackingTrainerId;
                        }else{
                            battle.winner = battle.opposingTrainerId;
                        }

                        // We make sure that there are no pokemon left in hpPointsPokemonsDuringBattle related to this battle
                        for (let j = 0 ; j < hpPointsPokemonsDuringBattle.length ; j++) {
                            if (hpPointsPokemonsDuringBattle[j].pokemonId == battle.opponentPokemonId || hpPointsPokemonsDuringBattle[j].pokemonId == battle.attackerPokemonId) {
                                hpPointsPokemonsDuringBattle.splice(j,1);
                            }
                        } // for
                    } //  if (i == attackedTrainerTeam!.length - 1)
                } //  if (attackedTrainerTeam![i].stats!.hp <= 0)
            } // if (attackedTrainerTeam![i].id === attackedPokemonId)
        } // for

        return this.battleRepository.update(battle);
    }
}

