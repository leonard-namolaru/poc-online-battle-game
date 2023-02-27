import {Pokemon} from "./entities";
import {IPokemonRepository} from "./interfaces";

export class CreatePokemonUsecase {
    private pokemonRepository: IPokemonRepository;

    constructor(pokemonRepository: IPokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }

    async execute(command: {pokedex: number, name: string, stats: {attack: number, hp: number}, item: {name: string, effect: number}, moves: {name: string, damage: number}[], exp: number, level: number}): Promise<Pokemon> {
        // create a new pokemon in db
        const newPokemon = await this.pokemonRepository.create({
            pokedex: command.pokedex,
            name: command.name,
            stats: command.stats,
            item: command.item,
            moves: command.moves,
            exp: command.exp,
            level: command.level
        });
        return newPokemon;
    }
}

