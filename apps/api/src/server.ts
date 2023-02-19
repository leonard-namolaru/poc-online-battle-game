import fastify, {FastifyInstance} from "fastify";
import {registerTrainerRoutes} from "./api/trainer.api";
import {battleRoutes} from "./api/battle.api";
import {pokemonRoutes} from "./api/pokemon.api";
import {registerUserRoutes} from "./api/user.api";
import {registerPokemonTeamRoutes} from "./api/pokemon-team.api";
import {initTrainerContainer} from "./domain/trainer.container";
import {initBattleContainer} from "./domain/battle.container";
import {initPokemonContainer} from "./domain/pokemon.container";
import { initUserContainer } from "./domain/user.container";
import {initPokemonTeamContainer} from "./domain/pokemon-team.container";
import cors from "@fastify/cors";


export let hpPointsPokemonsDuringBattle : {pokemonId : number, hp : number}[] = new Array();


const server: FastifyInstance = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
            },
        },
    }
});

//ADD CORS
server.register(cors, {});
// Run the server!
const start = async () => {
    try {
        const trainerContainer = initTrainerContainer()
        const battleContainer = initBattleContainer()
        const pokemonContainer = initPokemonContainer()
        const userContainer = initUserContainer()
        const pokemonTeamContainer = initPokemonTeamContainer();

        registerTrainerRoutes(server, trainerContainer, pokemonTeamContainer);
        pokemonRoutes(server, pokemonContainer);
        battleRoutes(server, trainerContainer, battleContainer, pokemonTeamContainer);
        registerUserRoutes(server,userContainer);
        registerPokemonTeamRoutes(server, pokemonTeamContainer);

        await server.listen({
            host: process.env.HOST,
            port: process.env.PORT as unknown as number || 3000
        })
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start();