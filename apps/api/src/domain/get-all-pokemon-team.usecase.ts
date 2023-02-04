import { PokemonTeam } from "./entities";
import { IPokemonTeamRepository } from "./interfaces";

export class GetAllPokemonTeamUsecase {
    private pokemonTeamRepository: IPokemonTeamRepository;

    constructor(pokemonTeamRepository: IPokemonTeamRepository) {
        this.pokemonTeamRepository = pokemonTeamRepository;
    }

    async execute(): Promise<PokemonTeam[]> {
        // return all pokemons teams in db
        const pokemons = await this.pokemonTeamRepository.findAll();
        return pokemons;
    }
}