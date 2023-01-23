import {FastifyInstance} from "fastify";
import {BattleContainer} from "../domain/battle.container";
import {TrainerContainer} from "../domain/trainer.container";

export const battleRoutes = (server: FastifyInstance, trainerContainer: TrainerContainer, battleContainer: BattleContainer) => {
    server.route({
        method: 'GET',
        url: '/battles', // http get request to : http://localhost:3000/battles
        handler: async (_request, reply) => {
            const battles = await battleContainer.getAllBattlesUsecase.execute();
            reply.status(200).send(battles);
        }
    });

    server.route<{ Params : { trainerId : string } }>({
        method: 'GET',
        url: '/battle/:trainerId', // http get request to (for example) : http://localhost:3000/battle/7
        handler: async (_request, reply) => {
            // We get the list of all trainers
            const trainers = await trainerContainer.getAllTrainersUsecase.execute();
            // The id of the attacking trainer as passed in the URL
            const attackingTrainerId = parseInt(_request.params.trainerId);
            // The index of the attacking trainer in the list of all trainers
            let attackingTrainerIndex = -1;

            for(let i = 0 ; i < trainers.length && attackingTrainerIndex == -1 ; i++) {
                if (trainers[i].id == attackingTrainerId)
                    attackingTrainerIndex = i;
            }

            if (attackingTrainerIndex == -1) {
                reply.status(404).send("The attacking trainer is not found.");
                return;
            }

            if (trainers.length < 2) {
                reply.status(204).send("The list of trainers does not include at least 2 trainers.");
                return;
            }

            let randomRivalTrainerIndex = -1;
            do {
                randomRivalTrainerIndex = Math.floor(Math.random() * trainers.length );
            }while (randomRivalTrainerIndex == attackingTrainerIndex); // The attacker's opponent cannot be the attacker himself

            const battle = await battleContainer.createBattleUsecase.execute({
                attackingTrainerId: attackingTrainerId,
                    opposingTrainerId: trainers[randomRivalTrainerIndex].id,
                    attackerPokemonLifePoints: 100,
                    opponentPokemonLifePoints: 100,
                    winner: -1
            });

            reply.status(200).send(battle);        }
    });

    server.route<{
        Body: { attackedTrainerId: number, dammage: number },
    }>({
        method: 'POST',
        url: '/battle/:trainerId', // ex: http post request to : http://localhost:3000/battle/7
        schema: { // The format of the request body (in JSON):  {"attackedTrainerId":"Id","dammage":"10"}
            body: {
                type: 'object',
                properties: {
                    attackedTrainerId: { type: 'number' },
                    dammage: { type: 'number' },
                },
                required: ['attackedTrainerId', 'dammage']
            }
        },
        handler: async (request, reply) => {
            const {attackedTrainerId, dammage} = request.body;
            const battle = await battleContainer.battleUsecase.doDammage({attackedTrainerId, dammage});
            reply.status(200).send(battle);
        }
    });

}