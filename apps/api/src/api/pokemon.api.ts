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
        Body: { name: string, userId : number },
    }>({
        method: 'POST',
        url: '/pokemon', // http post request to : http://localhost:3000/pokemon
        schema: { // The format of the request body (in JSON):  {"name":"Name", userId : 0}
            body: {
                type: 'object',
                properties: {
                    name:   { type: 'string' },
                    userId: { type: 'number' },
                },
                required: ['name', 'userId']
            }
        },
        handler: async (_request, reply) => {
            const {name, userId} = _request.body;

            try {
                const newPokemonFromApi : any = await pokeApiRepository.newPokemon(name);
                newPokemonFromApi.userId = userId as unknown as {"userId" : number};

                const newPokemon = await container.createPokemonUsecase.execute(newPokemonFromApi);
                reply.status(200).send(newPokemon);
            } catch (error : any) {
                reply.status(404).send(error);
            }

        }
    });
}