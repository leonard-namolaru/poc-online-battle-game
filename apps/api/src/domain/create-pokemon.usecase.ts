import {Pokemon} from "./entities";
import {IPokemonRepository} from "./interfaces";

export class CreatePokemonUsecase {
    private pokemonRepository: IPokemonRepository;

    constructor(pokemonRepository: IPokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }

    async execute(command: {pokedex: number,  name: string, exp:number, level:number}): Promise<Pokemon> {
        // create a new pokemon in db
        const newPokemon = await this.pokemonRepository.create({
            pokedex: command.pokedex,
            name: command.name,
            exp: command.exp,
            level: command.level
        });
        return newPokemon;
    }
}

