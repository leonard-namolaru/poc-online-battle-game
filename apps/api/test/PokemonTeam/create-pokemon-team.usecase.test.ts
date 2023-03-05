import { describe, expect, expectTypeOf, test, beforeAll, afterEach, vi } from 'vitest';
import { Pokemon, Trainer, PokemonTeam } from '../../src/domain/entities';
import { CreatePokemonTeamUsecase } from '../../src/domain/create-pokemon-team.usecase';

describe('Create PokemonTeam Usecase - test', () => {
    const pokemonTeamRepositoryMock = {
        create: vi.fn(),
        findAll: vi.fn(),
        find : vi.fn(),
        addToTeam : vi.fn(),
        removeFromTeam : vi.fn(),
    }

    const createPokemonTeamUsecase = new CreatePokemonTeamUsecase(pokemonTeamRepositoryMock);

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('should create ', async () => {
        // GIVEN
        const givenTrainerId = 66;
        const expectedPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainerId,
            pokemonList:[]
        };
        //const givenTrainer : Trainer = {id:givenTrainerId, name:"TotoTest", gender:"m"};
        pokemonTeamRepositoryMock.create.mockImplementation(() => expectedPokemonTeam);

        // WHEN
        const team = await createPokemonTeamUsecase.create(givenTrainerId);

        // THEN
        expect(pokemonTeamRepositoryMock.create).toHaveBeenCalledOnce();
        expectTypeOf(team.teamId).toBeNumber();
        expect(pokemonTeamRepositoryMock.create).toBeCalledWith(givenTrainerId);
        expect(expectedPokemonTeam).toStrictEqual(team);
    });
});