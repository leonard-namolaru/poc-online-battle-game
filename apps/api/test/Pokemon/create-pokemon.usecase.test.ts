import {afterEach, describe, expect, test, vi} from 'vitest'
import {initUserContainer} from "../../src/domain/user.container";
import {CreatePokemonUsecase} from "../../src/domain/create-pokemon.usecase";
import {Pokemon} from '../../src/domain/entities';

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
        const userContainer = initUserContainer()
        const newUserForPokemonUseCaseTest = await userContainer.createUserUsecase.execute({
            email : "lennynam@gmail.com",
            pwd   : "newUserForPokemonUseCaseTest",
            name: "",
            inscriptionDate: new Date,
            AllMyPokemon: [],
        });

        const expectedPokemon: Pokemon = {
            id : 1,
            pokedex: 25,
            name: 'pikachu',
            stats: { attack: 55, hp: 35 },
            item: {itemId : 1, name: 'test', effect: 3 },
            moves: [
                { name: 'mega-punch', damage: 80 },
                { name: 'pay-day', damage: 40 }
            ],
            exp: 112,
            level: 0
        }
        pokemonRepositoryMock.create.mockImplementation(() => expectedPokemon)

        // WHEN
        const pokemon = await createPokemonUsecase.execute({pokedex: expectedPokemon.pokedex,  name: expectedPokemon.name, exp: expectedPokemon.exp, level: expectedPokemon.level, moves : expectedPokemon.moves, stats : expectedPokemon.stats, item : expectedPokemon.item, userId : newUserForPokemonUseCaseTest.id})

        // THEN
        expect(pokemonRepositoryMock.create).toHaveBeenCalledOnce()
        expect(pokemonRepositoryMock.create).toBeCalledWith({
            pokedex: expectedPokemon.pokedex,
            name: expectedPokemon.name,
            stats: expectedPokemon.stats,
            item: expectedPokemon.item,
            moves: expectedPokemon.moves,
            exp: expectedPokemon.exp,
            level: expectedPokemon.level,
            userId : newUserForPokemonUseCaseTest.id
        })
        expect(expectedPokemon).toStrictEqual(expectedPokemon);
    })
})