import { FastifyInstance } from "fastify";
import { BattleContainer } from "../domain/Battle/battle.container";
import { TrainerContainer } from "../domain/Trainer/trainer.container";
import {PokemonTeamContainer} from "../domain/PokemonTeam/pokemon-team.container";
import {hpPointsPokemonsDuringBattle} from "../server"

export const battleRoutes = (
  server: FastifyInstance,
  trainerContainer: TrainerContainer,
  battleContainer: BattleContainer,
  pokemonTeamContainer: PokemonTeamContainer
) => {
  server.route({
    method: "GET",
    url: "/battles", // http get request to : http://localhost:3000/battles
    handler: async (_request, reply) => {
      const battles = await battleContainer.getAllBattlesUsecase.execute();
      reply.status(200).send(battles);
    },
  });

  server.route<{ Body: { trainerId: string} }>({
    method: "POST",
    url: "/CreateBattle", // http post request to (for example) : http://localhost:3000/CreatBattle
    schema: {
      // The format of the request body (in JSON):  {"trainerId": "id"}
      body: {
        type: "object",
        properties: {
          trainerId: { type: "string" }
        },
        required: ["trainerId"],
      },
    },
    handler: async (request, reply) => {
      const { trainerId } = request.body;
      // We get the list of all trainers
      const trainers = await trainerContainer.getAllTrainersUsecase.execute();
      // The id of the attacking trainer as passed in the URL
      const attackingTrainerId = parseInt(trainerId);

      // The index of the attacking trainer in the list of all trainers
      let attackingTrainerIndex = -1;

      for (let i = 0; i < trainers.length && attackingTrainerIndex == -1; i++) {
        if (trainers[i].id == attackingTrainerId) attackingTrainerIndex = i;
      }

      if (attackingTrainerIndex == -1) {
        reply.status(404).send("The attacking trainer is not found.");
        return;
      }

      const pokemonsTeams = await pokemonTeamContainer.getAllPokemonTeamsUsecase.execute();

      pokemonsTeams.forEach(element => {
          if (element.trainerId == attackingTrainerId)
            trainers[attackingTrainerIndex].activeTeam = element;
        });

      if (!trainers[attackingTrainerIndex].activeTeam || !trainers[attackingTrainerIndex].activeTeam!.pokemonList || trainers[attackingTrainerIndex].activeTeam!.pokemonList!.length == 0) {
        reply
            .status(404)
            .send("The attacking trainer does not have a Pokemon team or this team is empty.");
        return;
      }
      const attackerPokemonIdInt = trainers[attackingTrainerIndex].activeTeam!.pokemonList![0].id;

      if (trainers.length < 2) {
        reply
            .status(404)
            .send("The list of trainers does not contains at least 2 trainers.");
        return;
      }

      let randomRivalTrainerIndex = -1;
      do {
        randomRivalTrainerIndex = Math.floor(Math.random() * trainers.length);
      } while (randomRivalTrainerIndex == attackingTrainerIndex); // The attacker's opponent cannot be the attacker himself

      pokemonsTeams.forEach(element => {
        if (element.trainerId == trainers[randomRivalTrainerIndex].id)
          trainers[randomRivalTrainerIndex].activeTeam = element;
      });

      if (typeof trainers[randomRivalTrainerIndex].activeTeam == "undefined" || typeof trainers[randomRivalTrainerIndex].activeTeam!.pokemonList == "undefined"  || trainers[randomRivalTrainerIndex].activeTeam!.pokemonList!.length == 0) {
        reply
            .status(404)
            .send("The opposing trainer does not have a Pokemon team or this team is empty.");
        return;
      }
      const opponentPokemonIdInt = trainers[randomRivalTrainerIndex].activeTeam!.pokemonList![0].id;

      const battle = await battleContainer.createBattleUsecase.execute({
        attackingTrainerId: attackingTrainerId,
        opposingTrainerId: trainers[randomRivalTrainerIndex].id,
        attackerPokemonId: attackerPokemonIdInt,
        opponentPokemonId: opponentPokemonIdInt,
        winner: -1,
      });

      reply.status(200).send(battle);
    },
  });

  server.route<{
    Body: { attackedTrainerId: number; dammage: number };
  }>({
    method: "PUT",
    url: "/attack", // ex: http post request to : http://localhost:3000/attack
    schema: {
      // The format of the request body (in JSON):  {"attackedTrainerId":"Id","dammage":"10"}
      body: {
        type: "object",
        properties: {
          attackedTrainerId: { type: "number" },
          dammage: { type: "number" },
        },
        required: ["attackedTrainerId", "dammage"],
      },
    },
    handler: async (request, reply) => {
      const { attackedTrainerId, dammage } = request.body;
      const battle = await battleContainer.battleUsecase.doDammage({
        attackedTrainerId,
        dammage,
      })
      .catch((error) => reply.status(404).send(error));
      reply.status(200).send({battle : battle, hpPointsPokemonsDuringBattle : hpPointsPokemonsDuringBattle})
    },
  });
};
