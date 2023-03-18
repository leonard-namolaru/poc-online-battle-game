import {IUserRepository} from "../domain/interfaces";
import {Item, Pokemon, User} from "../domain/entities";
import {prisma} from "../../db";
import {TrainerRepository} from "./trainer.repository";
import bcrypt from "bcrypt";

export class UserRepository implements IUserRepository {

    static async createUserObject(user: {id: number, name: string, pwd: string, email: string, inscriptionDate: Date, uniqueToken: string, isValid: boolean, trainer: {id: number, name: string, gender: string, activeTeam: {teamId: number, trainerId: number} | null} | null, allMyPokemon: Pokemon[], itemList : Item[]}) : Promise<User> {

        return {id : user.id,
                name : user.name,
                pwd : user.pwd,
                email : user.email,
                inscriptionDate : user.inscriptionDate,
                uniqueToken : user.uniqueToken,
                isValid : user.isValid,
                trainer : (user.trainer != null) ? await TrainerRepository.createTrainerObjectIfActiveTeamIsNotNull(user.trainer!) : null,
                allMyPokemon : user.allMyPokemon,
                itemList : user.itemList
        };
    }

    async create(user: {name: string, pwd: string, email: string,
        inscriptionDate: Date, uniqueToken: string, isValid: boolean}): Promise<User> {
        const newUser = await prisma.user.create({
            data: {
                name: user.name,
                pwd: user.pwd,
                email: user.email,
                inscriptionDate: user.inscriptionDate,
                uniqueToken: user.uniqueToken,
                isValid: user.isValid
            },
            include : {
                itemList : true,
                allMyPokemon : {
                    include : {
                        item : true,
                        moves : true,
                        stats : true,
                        types : true,
                    },
                },
                trainer : {
                    include : {
                    activeTeam : true,
                    },
                },
            },
        });

        return UserRepository.createUserObject(newUser);
    }

    async findAll(): Promise<User[]> {
        const tmpList = await prisma.user.findMany({
            include : {
                itemList : true,
                allMyPokemon : {
                    include : {
                        item : true,
                        moves : true,
                        stats : true,
                        types : true,
                    },
                },
                trainer : {
                    include : {
                        activeTeam : true,
                    },
                },
            },
        });

        let users : User[] = new Array();
        for(let i = 0 ; i < tmpList.length ; i++) {
            try {
                const element = await UserRepository.createUserObject(tmpList[i]);
                users.push(element);
            } catch (error : any) {
                return error;
            }
        }

        return users;
    }

    async find(userId : number) : Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include : {
                itemList : true,
                allMyPokemon : {
                    include : {
                        item : true,
                        moves : true,
                        stats : true,
                        types: true,
                    },
                },
                trainer : {
                    include : {
                        activeTeam : true,
                    },
                },
            },
        })
        if (user === null){
            return Promise.reject("User not in DB.")
        }
        return UserRepository.createUserObject(user);
    }
    async findMyUserwithLogin(email: string, pwd: string): Promise<User> {

        const user = await prisma.user.findFirst({
            where: {
                email
            },
            include : {
                itemList : true,
                allMyPokemon : {
                    include : {
                        item : true,
                        moves : true,
                        stats : true,
                        types : true,
                    },
                },
                trainer : {
                    include : {
                        activeTeam : true,
                    },
                },
            },
        })

        if (user === null || !(await bcrypt.compare(pwd, user.pwd))){
            return Promise.reject("Login error");
        }

        return UserRepository.createUserObject(user);
    }

    async findUserToken(uniqueToken: string): Promise<User>{
        const user = await prisma.user.findFirst({
            where:{
                uniqueToken: uniqueToken
            },
            include : {
                itemList : true,
                allMyPokemon : {
                    include : {
                        item : true,
                        moves : true,
                        stats : true,
                        types : true,
                    },
                },
                trainer : {
                    include : {
                        activeTeam : true,
                    },
                },
            },
        })

        if (user === null){
            return Promise.reject("this user is not in DB.")
        }
        return UserRepository.createUserObject(user);
    }
    async update(user: User): Promise<User>{
        const ret = await prisma.user.update({
            where:{
                id: user.id
            },
            data: {
                isValid:user.isValid
            },
            include : {
                itemList : true,
                allMyPokemon : {
                    include : {
                        item : true,
                        moves : true,
                        stats : true,
                        types : true,
                    },
                },
                trainer : {
                    include : {
                        activeTeam : true,
                    },
                },
            },
        });

        return UserRepository.createUserObject(ret);
    }

    async delete(userId: number): Promise<boolean> {
        const ret = await prisma.user.delete({
            where: {
                id: userId
            }
        });
        if(ret === null){
            return false;
        }else{
            return true;
        }
    }
}
