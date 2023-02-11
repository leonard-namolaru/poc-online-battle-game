import {describe, expect, expectTypeOf, test} from 'vitest'
import {PokemonRepository} from "../src/infrastructure/pokemon.repository";
import {PokemonClient} from "pokenode-ts";

describe('Pokemon Repository - test', () => {
    const pokemonRepository = new PokemonRepository()

    test('#create', async () => {
        // GIVEN
        const pokemonApi = new PokemonClient();
        const data = await pokemonApi.getPokemonByName("pikachu")
        const name = data.name;
        const pokedex = data.id;
        const exp = data.base_experience;
        const level = 0;

        // WHEN
        const pokemon = await pokemonRepository.create({pokedex, name, exp, level});

        // THEN
        expectTypeOf(pokemon.id).toBeNumber();
        expect(pokemon.name).toEqual(name);
        expect(pokemon.pokedex).toEqual(pokedex);
        expect(pokemon.exp).toEqual(exp);
        expect(pokemon.level).toEqual(level);
    })
})