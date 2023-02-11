import {afterEach, describe, expect, test, vi} from 'vitest'
import {CreatePokemonUsecase} from "../src/domain/create-pokemon.usecase";
import {Pokemon} from '../src/domain/entities';

describe('Create Pokemon Usecase - test', () => {
    const pokemonRepositoryMock = {
        create: vi.fn(),
        findAll: vi.fn(),
        find: vi.fn(),
    }

    const createPokemonUsecase = new CreatePokemonUsecase(pokemonRepositoryMock)

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('should create ', async () => {
        // GIVEN
        const expectedPokemon: Pokemon = {
            id : 1,
            pokedex: 25,
            name: "pikachu",
            exp: 122,
            level: 0
        }
        pokemonRepositoryMock.create.mockImplementation(() => expectedPokemon)

        // WHEN
        const pokemon = await createPokemonUsecase.execute({pokedex: expectedPokemon.pokedex,  name: expectedPokemon.name, exp: expectedPokemon.exp, level: expectedPokemon.level})

        // THEN
        expect(pokemonRepositoryMock.create).toHaveBeenCalledOnce()
        expect(pokemonRepositoryMock.create).toBeCalledWith({
            pokedex: expectedPokemon.pokedex,
            name: expectedPokemon.name,
            exp: expectedPokemon.exp,
            level: expectedPokemon.level
        })
        expect(expectedPokemon).toStrictEqual(expectedPokemon);
    })
})