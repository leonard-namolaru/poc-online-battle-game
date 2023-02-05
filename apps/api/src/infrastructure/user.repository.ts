import {IUserRepository} from "../domain/interfaces";
import {User} from "../domain/entities";
import {prisma} from "../../db";


export class UserRepository implements IUserRepository {
    async create(user: {name: string, pwd: string, email: string,
        inscriptionDate: Date, myTrainer: number}): Promise<User> {
        const newUser = await prisma.user.create({
            data: {
                name: user.name,
                pwd: user.pwd,
                email: user.email,
                inscriptionDate: user.inscriptionDate,
            },
        });
        return newUser;
    }

    async findAll(): Promise<User[]> {
        const users: User[] = await prisma.user.findMany();

        return users;
    }

    async find(userId : number) : Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (user === null){
            return Promise.reject("User not in DB.")
        }
        return user
    }
    async findMyUserwithLogin(email: string, pwd: string): Promise<User> {
        const user = await prisma.user.findFirst({
            where: {
                email,pwd
            },
        })
        if (user === null){
            return Promise.reject("this user is not in DB.")
        }
        return user
    }
}
