import fastify, {FastifyInstance} from "fastify";
import {registerTrainerRoutes} from "./api/trainer.api";
import {initTrainerContainer} from "./domain/trainer.container";

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

// Run the server!
const start = async () => {
    try {
        const trainerContainer = initTrainerContainer()
        registerTrainerRoutes(server, trainerContainer);

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