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
            attackingTrainerId = battle.attackingTrainerId;
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
                                console.log(appliedDamage);
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
        if(TypeAttacked.name.toLowerCase()==="steel"){
            if(TypeAttacking.name.toLowerCase()==="fire" || TypeAttacking.name.toLowerCase()==="fighting" || TypeAttacking.name.toLowerCase()==="ground"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="dragon"){
            if(TypeAttacking.name.toLowerCase()==="psychic" || TypeAttacking.name.toLowerCase().toLowerCase()==="flying" || TypeAttacking.name.toLowerCase()==="fairy"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="dragon"){
            if(TypeAttacking.name.toLowerCase()==="dragon" || TypeAttacking.name.toLowerCase()==="fairy" || TypeAttacking.name.toLowerCase()==="ice"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="water"){
            if(TypeAttacking.name.toLowerCase()==="electric" || TypeAttacking.name.toLowerCase()==="grass"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="electric"){
            if(TypeAttacking.name.toLowerCase()==="ground"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="fairy"){
            if(TypeAttacking.name.toLowerCase()==="steel" || TypeAttacking.name.toLowerCase()==="poison" ){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="fire"){
            if(TypeAttacking.name.toLowerCase()==="water" || TypeAttacking.name.toLowerCase()==="rock" || TypeAttacking.name.toLowerCase()==="ground"  ){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="ice"){
            if(TypeAttacking.name.toLowerCase()==="fighting" || TypeAttacking.name.toLowerCase()==="rock" || TypeAttacking.name.toLowerCase()==="steel" || TypeAttacking.name.toLowerCase()==="fire" ){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="bug"){
            if(TypeAttacking.name.toLowerCase()==="fire" || TypeAttacking.name.toLowerCase()==="rock" || TypeAttacking.name.toLowerCase()==="flying"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="normal"){
            if(TypeAttacking.name.toLowerCase()==="fighting"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="grass"){
            if(TypeAttacking.name.toLowerCase()==="ice" || TypeAttacking.name.toLowerCase()==="fire" || TypeAttacking.name.toLowerCase()==="flying" || TypeAttacking.name.toLowerCase()==="bug"  || TypeAttacking.name.toLowerCase()==="poison"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="poison"){
            if(TypeAttacking.name.toLowerCase()==="psychic" || TypeAttacking.name.toLowerCase()==="ground"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="psychic"){
            if(TypeAttacking.name.toLowerCase()==="dark" || TypeAttacking.name.toLowerCase()==="ghost"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="rock"){
            if(TypeAttacking.name.toLowerCase()==="fighting" || TypeAttacking.name.toLowerCase()==="water" || TypeAttacking.name.toLowerCase()==="grass" || TypeAttacking.name.toLowerCase()==="ground" || TypeAttacking.name.toLowerCase()==="steel"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="ground"){
            if(TypeAttacking.name.toLowerCase()==="water" || TypeAttacking.name.toLowerCase()==="grass" || TypeAttacking.name.toLowerCase()==="ice"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="ghost"){
            if(TypeAttacking.name.toLowerCase()==="ghost" || TypeAttacking.name.toLowerCase()==="dark"){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="dark"){
            if(TypeAttacking.name.toLowerCase()==="fairy" || TypeAttacking.name.toLowerCase()==="bug" || TypeAttacking.name.toLowerCase()==="fighting" ){
                return damage*2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="flying"){
            if(TypeAttacking.name.toLowerCase()==="ice" || TypeAttacking.name.toLowerCase()==="rock" || TypeAttacking.name.toLowerCase()==="electric" ){
                return damage*2;
            }
        }
        return damage;
    }

    async resistance(TypeAttacked : Type,TypeAttacking : Type, damage : number) {
        if(TypeAttacked.name.toLowerCase()==="steel"){
            if(TypeAttacking.name.toLowerCase()==="electric" || TypeAttacking.name.toLowerCase()==="steel" || TypeAttacking.name.toLowerCase()==="rock" || TypeAttacking.name.toLowerCase()==="grass"|| TypeAttacking.name.toLowerCase()==="ice" || TypeAttacking.name.toLowerCase()==="dragon" || TypeAttacking.name.toLowerCase()==="psychic"|| TypeAttacking.name.toLowerCase()==="flying" || TypeAttacking.name.toLowerCase()==="fairy"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="fighting"){
            if(TypeAttacking.name.toLowerCase()==="dark" || TypeAttacking.name.toLowerCase()==="bug" || TypeAttacking.name.toLowerCase()==="rock"  ){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="dragon"){
            if(TypeAttacking.name.toLowerCase()==="water" || TypeAttacking.name.toLowerCase()==="fire" || TypeAttacking.name.toLowerCase()==="electric" || TypeAttacking.name.toLowerCase()==="grass"  ){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="water"){
            if(TypeAttacking.name.toLowerCase()==="water" || TypeAttacking.name.toLowerCase()==="ice" || TypeAttacking.name.toLowerCase()==="steel" || TypeAttacking.name.toLowerCase()==="fire"  ){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="electric"){
            if(TypeAttacking.name.toLowerCase()==="electric" || TypeAttacking.name.toLowerCase()==="steel" || TypeAttacking.name.toLowerCase()==="flying"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="fairy"){
            if(TypeAttacking.name.toLowerCase()==="fighting" || TypeAttacking.name.toLowerCase()==="bug" || TypeAttacking.name.toLowerCase()==="dark"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="fire"){
            if(TypeAttacking.name.toLowerCase()==="fire" || TypeAttacking.name.toLowerCase()==="grass" || TypeAttacking.name.toLowerCase()==="ice" || TypeAttacking.name.toLowerCase()==="steel" || TypeAttacking.name.toLowerCase()==="fairy" || TypeAttacking.name.toLowerCase()==="bug" ){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="ice"){
            if(TypeAttacking.name.toLowerCase()==="ice"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="bug"){
            if(TypeAttacking.name.toLowerCase()==="fighting" || TypeAttacking.name.toLowerCase()==="grass" || TypeAttacking.name.toLowerCase()==="ground"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="normal"){
            if(TypeAttacking.name.toLowerCase()==="ghost"){
                return damage*0;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="grass"){
            if(TypeAttacking.name.toLowerCase()==="water" || TypeAttacking.name.toLowerCase()==="electric" || TypeAttacking.name.toLowerCase()==="grass" || TypeAttacking.name.toLowerCase()==="ground"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="poison"){
            if(TypeAttacking.name.toLowerCase()==="poison" || TypeAttacking.name.toLowerCase()==="fairy" || TypeAttacking.name.toLowerCase()==="bug" || TypeAttacking.name.toLowerCase()==="fighting" || TypeAttacking.name.toLowerCase()==="grass"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="psychic"){
            if(TypeAttacking.name.toLowerCase()==="psychic" || TypeAttacking.name.toLowerCase()==="fighting"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="rock"){
            if(TypeAttacking.name.toLowerCase()==="fighting" || TypeAttacking.name.toLowerCase()==="water" || TypeAttacking.name.toLowerCase()==="grass" || TypeAttacking.name.toLowerCase()==="ground" || TypeAttacking.name.toLowerCase()==="steel"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="ground"){
            if(TypeAttacking.name.toLowerCase()==="fire" || TypeAttacking.name.toLowerCase()==="normal" || TypeAttacking.name.toLowerCase()==="poison"){
                return damage/2;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="ghost"){
            if(TypeAttacking.name.toLowerCase()==="bug" || TypeAttacking.name.toLowerCase()==="poison"){
                return damage/2;
            }
            if(TypeAttacking.name.toLowerCase()==="normal" || TypeAttacking.name.toLowerCase()==="fighting"){
                return 0;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="dark"){
            if(TypeAttacking.name.toLowerCase()==="dark" || TypeAttacking.name.toLowerCase()==="ghost"){
                return damage/2;
            }
            if(TypeAttacking.name.toLowerCase()==="psychic"){
                return 0;
            }
        }
        if(TypeAttacked.name.toLowerCase()==="flying"){
            if(TypeAttacking.name.toLowerCase()==="bug" || TypeAttacking.name.toLowerCase()==="grass"){
                return damage*2;
            }if(TypeAttacking.name.toLowerCase()==="ground"){
                return 0;
            }
        }
        return damage;
    }
}

