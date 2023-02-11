import {describe, expect, expectTypeOf, test, it } from 'vitest'
import {BattleRepository} from "../src/infrastructure/battle.repository";
import {initTrainerContainer} from "../src/domain/trainer.container";

export async function generateRandomAttackerAndOpponentForTest() : Promise<{ attackingTrainerId: number, opposingTrainerId: number }> {
    const trainerContainer = initTrainerContainer()
    const trainers = await trainerContainer.getAllTrainersUsecase.execute();

    if (trainers.length < 2) {
        // The battle system cannot be tested if there are not at least 2 trainers in the database
        await trainerContainer.createTrainerUsecase.execute({name: "test", gender: "m"} )
        return await generateRandomAttackerAndOpponentForTest();
    }

    const attackingTrainerIndex = Math.floor(Math.random() * trainers.length);
    let rivalTrainerIndex = -1;
    do {
        rivalTrainerIndex = Math.floor(Math.random() * trainers.length);
    } while (rivalTrainerIndex == attackingTrainerIndex); // The attacker's opponent cannot be the attacker himself

    return {attackingTrainerId : trainers[attackingTrainerIndex].id, opposingTrainerId : trainers[rivalTrainerIndex].id};
}
describe('Battle Repository - test', () => {
    const battleRepository = new BattleRepository()

    test('#create', async () => {
        const {attackingTrainerId, opposingTrainerId} = await generateRandomAttackerAndOpponentForTest();
        const attackerPokemonLifePoints  = 100;
        const opponentPokemonLifePoints  = 100;
        const winner  = -1;

        // WHEN
        const battle = await battleRepository.create({attackingTrainerId, opposingTrainerId, attackerPokemonLifePoints, opponentPokemonLifePoints, winner})

        // THEN
        expectTypeOf(battle.id).toBeNumber();
        expect(battle.attackingTrainerId).toEqual(attackingTrainerId);
        expect(battle.opposingTrainerId).toEqual(opposingTrainerId);
        expect(battle.attackerPokemonLifePoints).toEqual(attackerPokemonLifePoints);
        expect(battle.opponentPokemonLifePoints).toEqual(opponentPokemonLifePoints);
        expect(battle.winner).toEqual(winner);
    })
})
