import {FastifyInstance} from "fastify";
import {PokemonTeamContainer} from "../domain/pokemon-team.container";

export const registerPokemonTeamRoutes = (server: FastifyInstance, container: PokemonTeamContainer) => {

    server.route({
        method: 'GET',
        url: '/pkmn-team', // http get request to : http://localhost:3000/pkmn-team/
        handler: async (_request, reply) => {
            const pokemonsTeams = await container.getAllPokemonTeamsUsecase.execute()
            .catch((error) => reply.status(404).send(error));
            reply.status(200).send(pokemonsTeams);
        }
    });

    server.route<{
        Body: {trainerId : number},
    }>({
        method: 'POST',
        url: '/pkmn-team/create', // http get request to : http://localhost:3000/pkmn-team/create
        schema: { // The format of the request body (in JSON):  {"trainerId":"ID"}
            body: {
                type: 'object',
                properties: {
                    trainerId: { type: 'number' }
                },
                required: ['trainerId']
            }
        },
        handler: async (_request, reply) => {
            const {trainerId} = _request.body;
            const pokemonsTeam = await container.createPokemonTeamUsecase.create(trainerId)
            .catch((error) => reply.status(404).send(error));
            reply.status(200).send(pokemonsTeam);
        }
    });

    server.route<{
        Body: { teamId: number, pokemonId: number },
    }>({
        method: 'PUT',
        url: '/pkmn-team/add', // http get request to : http://localhost:3000/pkmn-team/add
        schema: { // The format of the request body (in JSON):  {"teamId":"ID", "pokemonId":"pokemonID"}
            body: {
                type: 'object',
                properties: {
                    teamId: { type: 'number' },
                    pokemonId: {type: 'number'}
                },
                required: ['teamId', 'pokemonId']
            }
        },
        handler: async (_request, reply) => {
            const {teamId, pokemonId} = _request.body;
            const pokemonsTeam = await container.updatePokemonTeamUsecase.addPokemon(teamId, pokemonId)
            .catch((error) => reply.status(404).send(error));
            reply.status(200).send(pokemonsTeam);
        }
    });

    server.route<{
        Body: { teamId: number, pokemonId: number },
    }>({
        method: 'PUT',
        url: '/pkmn-team/remove', // http get request to : http://localhost:3000/pkmn-team/remove
        schema: { // The format of the request body (in JSON):  {"teamId":"ID", "pokemonId":"pokemonID"}
            body: {
                type: 'object',
                properties: {
                    teamId: { type: 'number' },
                    pokemonId: {type: 'number'}
                },
                required: ['teamId', 'pokemonId']
            }
        },
        handler: async (_request, reply) => {
            const {teamId, pokemonId} = _request.body;
            const pokemonsTeam = await container.updatePokemonTeamUsecase.removePokemon(teamId, pokemonId)
            .catch((error) => reply.status(404).send(error));
            reply.status(200).send(pokemonsTeam);
        }
    });

}