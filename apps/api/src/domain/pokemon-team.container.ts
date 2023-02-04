import {PokemonRepository} from "../infrastructure/pokemon.repository";
import {PokemonTeamRepository} from "../infrastructure/pokemon-team.repository";
import { CreatePokemonTeamUsecase } from "./create-pokemon-team.usecase";
import { UpdatePokemonTeamUsecase } from "./update-pokemon-team.usecases";
import { GetAllPokemonTeamUsecase } from "./get-all-pokemon-team.usecase";

export type PokemonTeamContainer = {
    createPokemonTeamUsecase: CreatePokemonTeamUsecase;
    updatePokemonTeamUsecase: UpdatePokemonTeamUsecase;
    getAllPokemonTeamsUsecase: GetAllPokemonTeamUsecase;
}

export const initPokemonTeamContainer = (): PokemonTeamContainer => {
    const pokemonTeamRepository = new PokemonTeamRepository();
    const pokemonRepository = new PokemonRepository(); 
    const createPokemonTeamUsecase = new CreatePokemonTeamUsecase(pokemonTeamRepository);
    const updatePokemonTeamUsecase = new UpdatePokemonTeamUsecase(pokemonTeamRepository, pokemonRepository);
    const getAllPokemonTeamsUsecase = new GetAllPokemonTeamUsecase(pokemonTeamRepository);

    return {
        createPokemonTeamUsecase,
        updatePokemonTeamUsecase,
        getAllPokemonTeamsUsecase
    }
}