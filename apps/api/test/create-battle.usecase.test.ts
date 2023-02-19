import {afterEach, describe, expect, test, vi} from 'vitest'
import {CreateBattleUsecase} from "../src/domain/create-battle.usecase";
import {Battle} from '../src/domain/entities';
import {generateRandomAttackerAndOpponentForTest} from "./battle.repository.test"
describe('Create Battle Usecase - test', () => {
    const battleRepositoryMock = {
        create: vi.fn(),
        findAll: vi.fn(),
        find:  vi.fn(),
        findActiveBattleWithTrainerId : vi.fn(),
        update : vi.fn(),
    }

    let createBattleUsecase = new CreateBattleUsecase(battleRepositoryMock);

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('should create ', async () => {
        const {attackingTrainerId, opposingTrainerId} = await generateRandomAttackerAndOpponentForTest();

        // GIVEN
        const expectedBattle: Battle = {
            id: 1,
            attackingTrainerId:         attackingTrainerId,
            opposingTrainerId:          opposingTrainerId,
            attackerPokemonLifePoints:  100,
            opponentPokemonLifePoints:  100,
            winner:                     -1
        }

        battleRepositoryMock.create.mockImplementation(() => expectedBattle)

        // WHEN
        const battle = await createBattleUsecase.execute({ attackingTrainerId: expectedBattle.attackingTrainerId,
                                                                 opposingTrainerId: expectedBattle.opposingTrainerId,
                                                                 attackerPokemonLifePoints: expectedBattle.attackerPokemonLifePoints,
                                                                 opponentPokemonLifePoints: expectedBattle.opponentPokemonLifePoints,
                                                                 winner: expectedBattle.winner });

        // THEN
        expect(battleRepositoryMock.create).toHaveBeenCalledOnce()
        expect(battleRepositoryMock.create).toBeCalledWith({
            attackingTrainerId: expectedBattle.attackingTrainerId,
            opposingTrainerId: expectedBattle.opposingTrainerId,
            attackerPokemonLifePoints: expectedBattle.attackerPokemonLifePoints,
            opponentPokemonLifePoints: expectedBattle.opponentPokemonLifePoints,
            winner: expectedBattle.winner
        })
        expect(expectedBattle).toStrictEqual(battle);
    })
})