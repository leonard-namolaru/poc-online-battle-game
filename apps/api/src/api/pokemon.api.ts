import {FastifyInstance} from "fastify";
import {PokemonContainer} from "../domain/pokemon.container";
import {PokemonClient, MoveClient} from "pokenode-ts";
import {Move, Stats} from "../domain/entities";

export async function getPokemonStatsAndMoves(pokemonName: string): Promise<{ stats: Stats, moves: Move[] }> {
    const pokemonApi = new PokemonClient();
    const moveApi = new MoveClient();

    const response = await pokemonApi.getPokemonByName(pokemonName.toLowerCase())

        .then(async (data) => {
            let attackValue = 0;
            let hpValue = 0;

            data.stats.forEach(element => {
                if (element.stat.name == "attack")
                    attackValue = element.base_stat;
                else if (element.stat.name == "hp")
                    hpValue = element.base_stat;
            });

            let movesList: Move[] = new Array();
            for (let i = 0; i < data.moves.length && i < 2; i++) {
                const moveName = data.moves[i].move.name;
                let moveDamage = 0;

                await moveApi
                    .getMoveByName(moveName)
                    .then((data) => {
                        if (typeof data.power == "number")
                            moveDamage = data.power; // The base power of this move
                    })
                    .catch((_) => {
                        return {stats: {attack: -1, hp: -1}, moves: []};
                    });

                const newMove: Move = {name: moveName, damage: moveDamage};
                movesList.push(newMove)
            }
            return {stats: {attack: attackValue, hp: hpValue}, moves: movesList};
        })
        .catch( () => {return {stats: {attack: -1, hp: -1}, moves: []}});

    return response;
}

export const pokemonRoutes = (server: FastifyInstance, container: PokemonContainer) => {

    server.route({
        method: 'GET',
        url: '/pokemons', // http get request to : http://localhost:3000/pokemons
        handler: async (_request, reply) => {
            const pokemons = await container.getAllPokemonsUsecase.execute();

            for(let i = 0 ; i < pokemons.length ; i++) {
                let {stats, moves} = await getPokemonStatsAndMoves(pokemons[i].name);
                pokemons[i].stats = stats;
                pokemons[i].item = {id: 6, name: "test", effect: 3};
                pokemons[i].moves = moves;
            }
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
            const {name} = _request.body
            let {stats, moves} = await getPokemonStatsAndMoves(name.toLowerCase());
            const pokemonApi = new PokemonClient();

            await pokemonApi.getPokemonByName(name.toLowerCase())

                     .then(async (data) => {
                           // Create a new pokemon
                         const newPokemon = await container.createPokemonUsecase.execute({
                             pokedex: data.id,
                             name: name.toLowerCase(),
                             exp: data.base_experience,
                             level: 0
                         });

                         reply.status(200).send({
                             id: newPokemon.id,
                             pokedex: newPokemon.pokedex,
                             stats: stats,
                             item: {id: 6, name: "test", effect: 3},
                             moves: moves,
                             exp: newPokemon.exp,
                             level: newPokemon.level
                         });
                     })

                     .catch((error) => reply.status(404).send(error));
        }
    });
}