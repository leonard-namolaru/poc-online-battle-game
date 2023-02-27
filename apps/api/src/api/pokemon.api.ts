import {FastifyInstance} from "fastify";
import {PokemonContainer} from "../domain/pokemon.container";
import {PokeApiRepository} from "../infrastructure/poke-api.repository";

export const pokemonRoutes = (server: FastifyInstance, container: PokemonContainer, pokeApiRepository : PokeApiRepository) => {

    server.route({
        method: 'GET',
        url: '/pokemons', // http get request to : http://localhost:3000/pokemons
        handler: async (_request, reply) => {
            const pokemons = await container.getAllPokemonsUsecase.execute();
            reply.status(200).send(pokemons);
        }
    });

    server.route<{
        Body: { name: string},
    }>({
        method: 'POST',
        url: '/pokemon', // http post request to : http://localhost:3000/pokemon
        schema: { // The format of the request body (in JSON):  {"name":"Name"}
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                },
                required: ['name']
            }
        },
        handler: async (_request, reply) => {
            const {name} = _request.body;

            try {
                const newPokemon = await container.createPokemonUsecase.execute(await pokeApiRepository.newPokemon(name));
                reply.status(200).send(newPokemon);
            } catch (error : any) {
                reply.status(404).send(error);
            }

        }
    });
}