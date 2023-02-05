import {FastifyInstance} from "fastify";
import {UserContainer} from "../domain/user.container";

export const registerUserRoutes = (server: FastifyInstance, container: UserContainer) => {
    //stupid
    server.route({
        method: 'GET',
        url: '/seealllog', // http get request to : http://localhost:3000/login
        handler: async (_request, reply) => {
            console.log("jrjrrjrrj")
            //page ou on doit pouvoir donner son email + pwd et bam recherche dans la bd 
            const users = await container.getAllUsersUsecase.execute();
            console.log(users[0])
            reply.status(200).send(users);
        }
    });

    server.route<{
        Body: { email: string, pwd: string },
    }>({
        method: 'POST',
        url: '/login', // http post request to : http://localhost:3000/login
        schema: { // The format of the request body (in JSON):  {"email":"Email","pwd":"Pwd"}
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string' },
                    pwd: { type: 'string' },
                },
                required: ['email', 'pwd']
            }
        },
        handler: async (request, reply) => {
            const {email, pwd} = request.body
            // const user = await container.userUsecase.getLogin(email,pwd)
            const user = await container.createUserUsecase.execute({
                email,
                pwd,
                name: "",
                inscriptionDate: new Date,
                myTrainer: 0,
                AllMyPokemon: []
            });

            reply.status(200).send(user);
        }
    });
}