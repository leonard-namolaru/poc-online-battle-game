import {Battle, Trainer, Type} from "./entities";
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
        
        
        let attackingTrainerId : number;
        let attackedPokemonId : number;
        let attackingPokemonId: number;
        

        if(attackedTrainer.id === battle.opposingTrainerId){
            attackedPokemonId = battle.opponentPokemonId;
            attackingPokemonId = battle.attackerPokemonId;
            attackingTrainerId=battle.attackingTrainerId;
        }else{
            attackedPokemonId = battle.attackerPokemonId;
            attackingPokemonId = battle.opponentPokemonId;
            attackingTrainerId = battle.opposingTrainerId;
        }

        let attackingTrainer : Trainer;
        try {
            attackingTrainer = await this.trainerRepository.find(attackingTrainerId);
        } catch (e) {
            return Promise.reject("The attacked trainer was not found.");
        }
        const attackingTrainerTeam = attackingTrainer.activeTeam.pokemonList;
        

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
                let appliedDamage : number = attack.dammage;

                attackingLoop:
                for(let attacking = 0;attacking < attackingTrainerTeam.length;attacking++){
                    if(attackingTrainerTeam[attacking].id===attackingPokemonId){
                        for(let attackedType = 0;attackedType<attackedTrainerTeam[i].types.length;attackedType++){
                            for(let attackingType = 0;attackingType<attackingTrainerTeam[attacking].types.length;attackingType++){
                                if(appliedDamage===0){
                                    break attackingLoop;
                                }
                                appliedDamage = await this.weakness(attackedTrainerTeam[i].types[attackedType],attackingTrainerTeam[attacking].types[attackingType],appliedDamage);
                                appliedDamage = await this.resistance(attackedTrainerTeam[i].types[attackedType],attackingTrainerTeam[attacking].types[attackingType],appliedDamage);
                            }
                        }
                    }
                }

                attackedTrainerTeam[i].stats.hp -= appliedDamage;
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

    async weakness(TypeAttacked : Type,TypeAttacking : Type, damage : number) {
        if(TypeAttacked.name==="Acier"){
            if(TypeAttacking.name==="Feu" || TypeAttacking.name==="Combat" || TypeAttacking.name==="Sol"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Combat"){
            if(TypeAttacking.name==="Psy" || TypeAttacking.name==="Vol" || TypeAttacking.name==="Fee"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Dragon"){
            if(TypeAttacking.name==="Dragon" || TypeAttacking.name==="Fee" || TypeAttacking.name==="Glace"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Eau"){
            if(TypeAttacking.name==="Electrik" || TypeAttacking.name==="Plante"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Electrik"){
            if(TypeAttacking.name==="Sol"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Fee"){
            if(TypeAttacking.name==="Acier" || TypeAttacking.name==="Poison" ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Feu"){
            if(TypeAttacking.name==="Eau" || TypeAttacking.name==="Roche" || TypeAttacking.name==="Sol"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Glace"){
            if(TypeAttacking.name==="Combat" || TypeAttacking.name==="Roche" || TypeAttacking.name==="Acier" || TypeAttacking.name==="Feu" ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Insecte"){
            if(TypeAttacking.name==="Feu" || TypeAttacking.name==="Roche" || TypeAttacking.name==="Vol"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Normal"){
            if(TypeAttacking.name==="Combat"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Plante"){
            if(TypeAttacking.name==="Glace" || TypeAttacking.name==="Feu" || TypeAttacking.name==="Vol" || TypeAttacking.name==="Insecte"  || TypeAttacking.name==="Poison"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Poison"){
            if(TypeAttacking.name==="Psy" || TypeAttacking.name==="Sol"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Psy"){
            if(TypeAttacking.name==="Tenebre" || TypeAttacking.name==="Spectre"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Roche"){
            if(TypeAttacking.name==="Combat" || TypeAttacking.name==="Eau" || TypeAttacking.name==="Plante" || TypeAttacking.name==="Sol" || TypeAttacking.name==="Acier"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Sol"){
            if(TypeAttacking.name==="Eau" || TypeAttacking.name==="Plante" || TypeAttacking.name==="Glace"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Spectre"){
            if(TypeAttacking.name==="Spectre" || TypeAttacking.name==="Tenebre"){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Tenebre"){
            if(TypeAttacking.name==="Fee" || TypeAttacking.name==="Insecte" || TypeAttacking.name==="Combat" ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Vol"){
            if(TypeAttacking.name==="Glace" || TypeAttacking.name==="Roche" || TypeAttacking.name==="Electrik" ){
                return damage*2;
            }
        }
        return damage;
    }

    async resistance(TypeAttacked : Type,TypeAttacking : Type, damage : number) {
        if(TypeAttacked.name==="Acier"){
            if(TypeAttacking.name==="Electrik" || TypeAttacking.name==="Acier" || TypeAttacking.name==="Roche" || TypeAttacking.name==="Plante"|| TypeAttacking.name==="Glace" || TypeAttacking.name==="Dragon" || TypeAttacking.name==="Psy"|| TypeAttacking.name==="Vol" || TypeAttacking.name==="Fee"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Combat"){
            if(TypeAttacking.name==="Tenebre" || TypeAttacking.name==="Insecte" || TypeAttacking.name==="Roche"  ){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Dragon"){
            if(TypeAttacking.name==="Eau" || TypeAttacking.name==="Feu" || TypeAttacking.name==="Electrik" || TypeAttacking.name==="Plante"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name==="Eau"){
            if(TypeAttacking.name==="Eau" || TypeAttacking.name==="Glace" || TypeAttacking.name==="Acier" || TypeAttacking.name==="Feu"  ){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Electrik"){
            if(TypeAttacking.name==="Electrik" || TypeAttacking.name==="Acier" || TypeAttacking.name==="Vol"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Fee"){
            if(TypeAttacking.name==="Combat" || TypeAttacking.name==="Insecte" || TypeAttacking.name==="Tenebre"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Feu"){
            if(TypeAttacking.name==="Feu" || TypeAttacking.name==="Eau" || TypeAttacking.name==="Glace" || TypeAttacking.name==="Acier" || TypeAttacking.name==="Fee" || TypeAttacking.name==="Insecte" ){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Glace"){
            if(TypeAttacking.name==="Glace"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Insecte"){
            if(TypeAttacking.name==="Combat" || TypeAttacking.name==="Plante" || TypeAttacking.name==="Sol"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Normal"){
            if(TypeAttacking.name==="Spectre"){
                return damage*0;
            }
        }
        if(TypeAttacked.name==="Plante"){
            if(TypeAttacking.name==="Eau" || TypeAttacking.name==="Electrik" || TypeAttacking.name==="Plante" || TypeAttacking.name==="Sol"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Poison"){
            if(TypeAttacking.name==="Poison" || TypeAttacking.name==="Fee" || TypeAttacking.name==="Insecte" || TypeAttacking.name==="Combat" || TypeAttacking.name==="Plante"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Psy"){
            if(TypeAttacking.name==="Psy" || TypeAttacking.name==="Combat"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Roche"){
            if(TypeAttacking.name==="Combat" || TypeAttacking.name==="Eau" || TypeAttacking.name==="Plante" || TypeAttacking.name==="Sol" || TypeAttacking.name==="Acier"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Sol"){
            if(TypeAttacking.name==="Feu" || TypeAttacking.name==="Normal" || TypeAttacking.name==="Poison"){
                return damage/2;
            }
        }
        if(TypeAttacked.name==="Spectre"){
            if(TypeAttacking.name==="Insecte" || TypeAttacking.name==="Poison"){
                return damage/2;
            }
            if(TypeAttacking.name==="Normal" || TypeAttacking.name==="Combat"){
                return 0;
            }
        }
        if(TypeAttacked.name==="Tenebre"){
            if(TypeAttacking.name==="Tenebre" || TypeAttacking.name==="Spectre"){
                return damage/2;
            }
            if(TypeAttacking.name==="Psy"){
                return 0;
            }
        }
        if(TypeAttacked.name==="Vol"){
            if(TypeAttacking.name==="Insecte" || TypeAttacking.name==="Plante"){
                return damage*2;
            }if(TypeAttacking.name==="Sol"){
                return 0;
            }
        }
        return damage;
    }
}

