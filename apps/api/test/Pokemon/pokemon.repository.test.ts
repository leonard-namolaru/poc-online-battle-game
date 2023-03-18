import {describe, expect, expectTypeOf, test} from 'vitest'
import {PokemonRepository} from "../../src/infrastructure/pokemon.repository";
import {initUserContainer} from "../../src/domain/User/user.container";

describe('Pokemon Repository - test', async () => {
    const pokemonRepository = new PokemonRepository();

    const userContainer = initUserContainer()
    const newUserForPokemonRepositoryTest = await userContainer.createUserUsecase.execute({
        email : "test5_" + (new Date()).getMilliseconds() + "@test.test",
        pwd   : "newUserForPokemonRepositoryTest",
        name: "",
        inscriptionDate: new Date,
        AllMyPokemon: [],
    });

    test('#create', async () => {
        const expectedPokemon : any = {
            pokedex: 25,
            name: 'pikachu',
            stats: { attack: 55, hp: 35 },
            item: {name: 'test', effect: 3 },
            moves: [
                { name: 'mega-punch', damage: 80 },
                { name: 'pay-day', damage: 40 }
            ],
            types : [
                {name: 'electric'}
            ],
            exp: 112,
            level: 0
        }

        // WHEN
        expectedPokemon.userId = newUserForPokemonRepositoryTest.id as unknown as {"userId" : number};
        const pokemon = await pokemonRepository.create(expectedPokemon);

        // THEN
        expectTypeOf(pokemon.id).toBeNumber();
        expect(pokemon.name).toEqual(expectedPokemon.name);
        expect(pokemon.pokedex).toEqual(expectedPokemon.pokedex);
        expect(pokemon.exp).toEqual(expectedPokemon.exp);
        expect(pokemon.level).toEqual(expectedPokemon.level);
    })
})