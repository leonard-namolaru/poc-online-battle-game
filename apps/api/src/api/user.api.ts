import {FastifyInstance} from "fastify";
import {UserContainer} from "../domain/user.container";

export const registerUserRoutes = (server: FastifyInstance, container: UserContainer) => {
    //stupid
    server.route({
        method: 'GET',
        url: '/seealllog', // http get request to : http://localhost:3000/login
        handler: async (_request, reply) => {

            const users = await container.getAllUsersUsecase.execute();
            reply.status(200).send(users);
        }
    });

    server.get('/verify/:uniqueToken', async function (req, repl){   
        var tokenlist= Object.values(req.params as object)
        var token = tokenlist.at(0)

       if (typeof token == "string"){
            var user = await container.userUsecase.getToken(token)
            if(user){
                user.isValid = true
                await container.userUsecase.updateToken(user)
                repl.redirect("http://localhost:9000/trainer")
                // repl.status(200).send("/trainer")
            }else{
                console.log("INTROUVALBE")
            }

       }else{
        console.log("PAS UN STRING")
        console.log("type of ", typeof token)
        console.log(token)
       }
    //    return user       
    })

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

            const user = await container.userUsecase.getLogin(email,pwd)
            reply.status(200).send(user);
        }
    });

    server.route<{
        Body: { email: string, pwd: string },
    }>({
        method: 'POST',
        url: '/createUser', // http post request to : http://localhost:3000/createUser
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

            const user = await container.createUserUsecase.execute({
                email,
                pwd,
                name: "",
                inscriptionDate: new Date,
                AllMyPokemon: [],
            });

            reply.status(200).send(user);
        }
    });

}