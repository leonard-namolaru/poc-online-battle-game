import {IPokemonRepository} from "../domain/interfaces";
import {Pokemon} from "../domain/entities";
import {prisma} from "../../db";


export class PokemonRepository implements IPokemonRepository {
    async create(pokemon: {pokedex: number,  name: string, exp:number, level:number}): Promise<Pokemon> {
        const newPokemon = await prisma.pokemon.create({
            data: {
                pokedex: pokemon.pokedex,
                name: pokemon.name,
                exp: pokemon.exp,
                level: pokemon.level
            },
        });

        return newPokemon;
    }



    async findAll(): Promise<Pokemon[]> {
        const pokemons: Pokemon[] = await prisma.pokemon.findMany();

        return pokemons;
    }

    async find(pokemonId : number) : Promise<Pokemon> {
        const pokemon = await prisma.pokemon.findUnique({
            where: {
                id: pokemonId
            }
        })
        if (pokemon === null){
            return Promise.reject("Pokemon not in DB.")
        }
        return pokemon
    }
}