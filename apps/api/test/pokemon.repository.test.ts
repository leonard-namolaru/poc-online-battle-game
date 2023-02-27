import {describe, expect, expectTypeOf, test} from 'vitest'
import {PokemonRepository} from "../src/infrastructure/pokemon.repository";

describe('Pokemon Repository - test', () => {
    const pokemonRepository = new PokemonRepository();

    test('#create', async () => {
        const expectedPokemon = {
            pokedex: 25,
            name: 'pikachu',
            stats: { attack: 55, hp: 35 },
            item: {name: 'test', effect: 3 },
            moves: [
                { name: 'mega-punch', damage: 80 },
                { name: 'pay-day', damage: 40 }
            ],
            exp: 112,
            level: 0
        }

        // WHEN
        const pokemon = await pokemonRepository.create(expectedPokemon);

        // THEN
        expectTypeOf(pokemon.id).toBeNumber();
        expect(pokemon.name).toEqual(expectedPokemon.name);
        expect(pokemon.pokedex).toEqual(expectedPokemon.pokedex);
        expect(pokemon.exp).toEqual(expectedPokemon.exp);
        expect(pokemon.level).toEqual(expectedPokemon.level);
    })
})