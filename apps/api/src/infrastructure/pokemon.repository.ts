import {IPokemonRepository} from "../domain/interfaces";
import {Pokemon} from "../domain/entities";
import {prisma} from "../../db";




export class PokemonRepository implements IPokemonRepository {
    async create(pokemon: {pokedex: number, name: string, stats: {attack: number, hp: number}, item: {name: string, effect: number}, moves: {name: string, damage: number}[], exp: number, level: number, userId : number,types: {name: string}[]}): Promise<Pokemon> {

        const newPokemon = await prisma.pokemon.create({
            data: {
                pokedex: pokemon.pokedex,
                name: pokemon.name,
                stats: {
                    create : {
                        attack : pokemon.stats.attack,
                        hp     : pokemon.stats.hp,
                    },
                },
                item: {
                    create : {
                        name : pokemon.item.name,
                        effect : pokemon.item.effect,
                        user : {
                            connect: { id: pokemon.userId },
                        },
                    }
                },
                moves: {
                    create : pokemon.moves
                },
                exp: pokemon.exp,
                level: pokemon.level,
                user : {
                    connect: { id: pokemon.userId },
                },
                types : {
                    create : pokemon.types
                },
            },
            include : {
                item : true,
                moves : true,
                stats : true,
                types : true,
            }
        });

        return newPokemon;
    }


    async findAll(userId: number): Promise<Pokemon[]> {
        const pokemons: Pokemon[] = await prisma.pokemon.findMany({ include : {item : true, moves : true, stats : true, types : true},
            where: {
                userId: userId
               },
        });

        return pokemons;
    }

    async find(pokemonId : number) : Promise<Pokemon> {
        const pokemon = await prisma.pokemon.findUnique({
            where: {
                id: pokemonId
            },
            include : {
                item : true,
                moves : true,
                stats : true,
                types: true,
            }
        })
        if (pokemon === null){
            return Promise.reject("Pokemon not in DB.")
        }
        return pokemon
    }
}