import {PokemonRepository} from "../../infrastructure/pokemon.repository";
import {CreatePokemonUsecase} from "./create-pokemon.usecase";
import {GetAllPokemonsUsecase} from "./get-all-pokemons.usecase";

export type PokemonContainer = {
    createPokemonUsecase: CreatePokemonUsecase;
    getAllPokemonsUsecase: GetAllPokemonsUsecase;
}
export const initPokemonContainer = (): PokemonContainer => {
    const pokemonRepository = new PokemonRepository();
    const createPokemonUsecase = new CreatePokemonUsecase(pokemonRepository);
    const getAllPokemonsUsecase = new GetAllPokemonsUsecase(pokemonRepository);

    return {
        createPokemonUsecase,
        getAllPokemonsUsecase,
    }
}