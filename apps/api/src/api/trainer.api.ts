import { FastifyInstance } from "fastify";
import { TrainerContainer } from "../domain/Trainer/trainer.container";

export const registerTrainerRoutes = (
  server: FastifyInstance,
  container: TrainerContainer
  ) => {

  server.route({
    method: "GET",
    url: "/trainers", // http get request to : http://localhost:3000/trainers
    handler: async (_request, reply) => {
      const trainers = await container.getAllTrainersUsecase.execute();
      reply.status(200).send(trainers);
    },
  });

  server.route<{
    Body: { name: string , gender: string, userId : number };
  }>({
    method: "POST",
    url: "/trainers", // http post request to : http://localhost:3000/trainers
    schema: {
      // The format of the request body (in JSON):  { "name":"Name","gender":"f", "userId" : 5}
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          gender: { type: "string" },
          userId: { type: "number" }
        },
        required: ["name", "gender", "userId"],
      },
    },
    handler: async (request, reply) => {
      const { name, gender, userId } = request.body;


      const trainer = await container.createTrainerUsecase.execute({
        name: name,
        gender: gender,
        userId : userId
      });

      reply.status(200).send(trainer);
    },
  });


  server.route<{
    Body: { id: number, name: string, gender: string };
  }>({
    method: "PUT",
    url: "/UpdateTrainer", // http post request to : http://localhost:3000/UpdateTrainer
    schema: {
      // The format of the request body (in JSON):  {"id":"ID","name":"Name","gender":"f"}
      body: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          gender: { type: "string" },
        },
        required: ["id", "name", "gender"],
      },
    },
    handler: async (request, reply) => {
      const { id, name, gender } = request.body;

      const trainer = await container.updateTrainerUsecase.execute({
        id :id,
        name : name,
        gender : gender
      });

      reply.status(200).send(trainer);
    },
  });

  server.route<{
    Body: { id: number };
  }>({
    method: "DELETE",
    url: "/DeleteTrainer", // http post request to : http://localhost:3000/DeleteTrainer
    schema: {
      // The format of the request body (in JSON):  {"id":"ID"}
      body: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
    },
    handler: async (request, reply) => {
      const { id } = request.body;
      const trainer = await container.deleteTrainerUsecase.execute({
        id
      });

      reply.status(200).send(trainer);
    },
  });
};
