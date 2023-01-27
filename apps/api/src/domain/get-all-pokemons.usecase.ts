import { Pokemon } from "./entities";
import { IPokemonRepository } from "./interfaces";

export class GetAllPokemonsUsecase {
    private pokemonRepository: IPokemonRepository;

    constructor(pokemonRepository: IPokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }

    async execute(): Promise<Pokemon[]> {
        // return all pokemons in db
        const pokemons = await this.pokemonRepository.findAll();
        return pokemons;
    }
}
