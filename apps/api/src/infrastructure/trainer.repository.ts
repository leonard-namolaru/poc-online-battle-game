import {ITrainerRepository} from "../domain/interfaces";
import {Trainer} from "../domain/entities";
import {prisma} from "../../db";


export class TrainerRepository implements ITrainerRepository {
    async create(trainer: { name: string, gender: string }): Promise<Trainer> {
        const newTrainer = await prisma.trainer.create({
            data: {
                name: trainer.name,
                gender: trainer.gender,
            },
        });
        return newTrainer;
    }

    async findAll(): Promise<Trainer[]> {
        const trainers: Trainer[] = await prisma.trainer.findMany();

        return trainers;
    }

    async find(trainerId : number) : Promise<Trainer> {
        const trainer = await prisma.trainer.findUnique({
            where: {
                id: trainerId
            }
        })
        if (trainer === null){
            return Promise.reject("Trainer not in DB.")
        }
        return trainer
    }
    async update(trainer: Trainer): Promise<Trainer>{
        const ret = await prisma.trainer.update({
            where:{
                id: trainer.id
            },
            data: {
                name: trainer.name,
                gender: trainer.gender,

            }
        });
        return ret;
    }
    async delete(trainerId : number): Promise<Trainer>{
        const ret = await prisma.trainer.delete({
            where:{
                id: trainerId
            },
        });
        return ret;
    }
    

}
