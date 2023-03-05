import { PokemonTeam } from "./entities";
import { Pokemon } from "./entities";
import { IPokemonTeamRepository } from "./interfaces";
import {IPokemonRepository} from "./interfaces";

export class UpdatePokemonTeamUsecase {
    private pokemonTeamRepository: IPokemonTeamRepository;
    private pokemonRepository: IPokemonRepository;

    constructor(pokemonTeamRepository: IPokemonTeamRepository, pokemonRepository: IPokemonRepository) {
        this.pokemonTeamRepository = pokemonTeamRepository;
        this.pokemonRepository = pokemonRepository;
    }

    async addPokemon(teamId: number, pokemonIdToAdd: number): Promise<PokemonTeam> {
        const pokemonTeam: PokemonTeam = await this.pokemonTeamRepository.find(teamId);
        
        if(pokemonTeam.pokemonList!.length >= 6){
            return Promise.reject("This team is full. Maximum 6 pokemons per team are allowed.");
        }
        const pokemon: Pokemon = await this.pokemonRepository.find(pokemonIdToAdd);
        if (pokemon == undefined){
            return Promise.reject("Pokemon not found in DB");
        }
        // Check if the pokemon is already added to this team.
        // For loop because indexOf and include does not work.
        let index = -1;
        for (let i = 0; i < pokemonTeam.pokemonList!.length; i++) {
            if(pokemonTeam.pokemonList![i].id === pokemon.id){
                index = i;
                break;
            }
        }
        if(index > -1){
            return Promise.reject("Pokemon already in this team.");
        }
        // Must check if the given pokemon belongs to the owner of the team (trainer).
        // TODO when implemneted in the model.
        pokemonTeam.pokemonList!.push(pokemon);
        const updatedPokemonTeam = await this.pokemonTeamRepository.addToTeam(pokemonTeam, pokemon.id);
        return updatedPokemonTeam;
    }

    async removePokemon(teamId: number, pokemonIdToRemove: number): Promise<PokemonTeam> {
        const pokemonTeam: PokemonTeam = await this.pokemonTeamRepository.find(teamId);
        const pokemon: Pokemon = await this.pokemonRepository.find(pokemonIdToRemove);
        if (pokemon == undefined){
            return Promise.reject("Pokemon not found in DB");
        }
        
        // For loop because indexOf and include does not work.
        let index = -1;
        for (let i = 0; i < pokemonTeam.pokemonList!.length; i++) {
            if(pokemonTeam.pokemonList![i].id === pokemon.id){
                index = i;
                break;
            }
        }

        // Must check if the given pokemon belongs to the owner of the team (trainer).
        //TODO when implemneted in the model.
        
        if (index > -1) { // only splice array when item is found
            pokemonTeam.pokemonList!.splice(index, 1); // 2nd parameter means remove one item only
        }else{
            return Promise.reject("This team does not contain the given pokemon.");
        }
        const updatedPokemonTeam = await this.pokemonTeamRepository.removeFromTeam(pokemonTeam, pokemon.id);
        return updatedPokemonTeam;
    }
}