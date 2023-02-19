import {describe, expect, expectTypeOf, test, it } from 'vitest'
import {BattleRepository} from "../src/infrastructure/battle.repository";
import {initTrainerContainer} from "../src/domain/trainer.container";
import {initPokemonContainer} from "../src/domain/pokemon.container";
import {initPokemonTeamContainer} from "../src/domain/pokemon-team.container";

export async function generateRandomAttackerAndOpponentForTest() : Promise<{ attackingTrainerId: number; opposingTrainerId: number; attackerPokemonId: number; opponentPokemonId: number; winner: number; }> {
    const trainerContainer = initTrainerContainer()
    const trainers = await trainerContainer.getAllTrainersUsecase.execute();

    const pokemonTeamContainer = initPokemonTeamContainer();
    const pokemonsTeams = await pokemonTeamContainer.getAllPokemonTeamsUsecase.execute();

    const pokemonContainer = initPokemonContainer();
    const pokemons = await pokemonContainer.getAllPokemonsUsecase.execute();

    if (trainers.length < 2) {
        // The battle system cannot be tested if there are not at least 2 trainers in the database
        await trainerContainer.createTrainerUsecase.execute({name: "test", gender: "m"})
        return await generateRandomAttackerAndOpponentForTest();
    }

    const attackingTrainerIndex = Math.floor(Math.random() * trainers.length);
    let rivalTrainerIndex = -1;
    do {
        rivalTrainerIndex = Math.floor(Math.random() * trainers.length);
    } while (rivalTrainerIndex == attackingTrainerIndex); // The attacker's opponent cannot be the attacker himself

    pokemonsTeams.forEach(element => {
        if (element.trainerId == trainers[attackingTrainerIndex].id)
            trainers[attackingTrainerIndex].activeTeam = element;
        else if (element.trainerId == trainers[rivalTrainerIndex].id)
            trainers[rivalTrainerIndex].activeTeam = element;
    });

    if (!trainers[attackingTrainerIndex].activeTeam || !trainers[attackingTrainerIndex].activeTeam!.pokemonList)
        trainers[attackingTrainerIndex].activeTeam = await pokemonTeamContainer.createPokemonTeamUsecase.create(trainers[attackingTrainerIndex].id)

    if (!trainers[rivalTrainerIndex].activeTeam || !trainers[rivalTrainerIndex].activeTeam!.pokemonList)
        trainers[rivalTrainerIndex].activeTeam = await pokemonTeamContainer.createPokemonTeamUsecase.create(trainers[rivalTrainerIndex].id)

    if (trainers[attackingTrainerIndex].activeTeam!.pokemonList!.length == 0) {
        const pokemon = await pokemonContainer.createPokemonUsecase.execute({pokedex: 1, name: "bulbasaur", exp: 64, level: 0})
        const updatedPokemonTeam = await pokemonTeamContainer.updatePokemonTeamUsecase.addPokemon(trainers[attackingTrainerIndex].activeTeam.teamId, pokemon.id);
        trainers[attackingTrainerIndex].activeTeam = updatedPokemonTeam;
    }

    if (trainers[rivalTrainerIndex].activeTeam!.pokemonList!.length == 0) {
        const pokemon = await pokemonContainer.createPokemonUsecase.execute({pokedex: 1, name: "bulbasaur", exp: 64, level: 0})
        const updatedPokemonTeam = await pokemonTeamContainer.updatePokemonTeamUsecase.addPokemon(trainers[rivalTrainerIndex].activeTeam.teamId, pokemon.id);
        trainers[rivalTrainerIndex].activeTeam = updatedPokemonTeam;
    }

    const attackerPokemonId = trainers[attackingTrainerIndex].activeTeam!.pokemonList![0].id;
    const opponentPokemonId = trainers[rivalTrainerIndex].activeTeam!.pokemonList![0].id;

    return {attackingTrainerId:  trainers[attackingTrainerIndex].id,
            opposingTrainerId: trainers[rivalTrainerIndex].id,
            attackerPokemonId: attackerPokemonId,
            opponentPokemonId: opponentPokemonId,
            winner: -1 };
}
describe('Battle Repository - test', () => {
    const battleRepository = new BattleRepository()

    test('#create', async () => {
        const {attackingTrainerId, opposingTrainerId, attackerPokemonId, opponentPokemonId, winner} = await generateRandomAttackerAndOpponentForTest();

        // WHEN
        const battle = await battleRepository.create({attackingTrainerId, opposingTrainerId, attackerPokemonId, opponentPokemonId, winner})

        // THEN
        expectTypeOf(battle.id).toBeNumber();
        expect(battle.attackingTrainerId).toEqual(attackingTrainerId);
        expect(battle.opposingTrainerId).toEqual(opposingTrainerId);
        expect(battle.attackerPokemonId).toEqual(attackerPokemonId);
        expect(battle.opponentPokemonId).toEqual(opponentPokemonId);
        expect(battle.winner).toEqual(winner);
    })
})
