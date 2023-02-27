import {ITrainerRepository} from "../domain/interfaces";
import {Trainer} from "../domain/entities";
import {prisma} from "../../db";
import {PokemonTeamRepository} from "./pokemon-team.repository";

export class TrainerRepository implements ITrainerRepository {

    static async createTrainerObjectIfActiveTeamIsNotNull(trainer: {id: number, name: string, gender: string, activeTeam: {teamId: number, trainerId: number} | null}) : Promise<Trainer> {
        const pokemonTeamRepository = new PokemonTeamRepository();

        if (typeof trainer.activeTeam == null) {
            return Promise.reject("The trainer " + trainer.id + " does not have an active team.");
        }

        return {id : trainer.id, name : trainer.name, gender : trainer.gender, activeTeam : await pokemonTeamRepository.buildPokemonTeamEntity(trainer.activeTeam!.teamId, trainer.id)};
    }
    async create(trainer: { name: string, gender: string }): Promise<Trainer> {
        const newTrainer = await prisma.trainer.create({
            data: {
                name: trainer.name,
                gender: trainer.gender,
                activeTeam: {
                    create : {}
                }
            },
            include: {activeTeam: true},
        });

        return TrainerRepository.createTrainerObjectIfActiveTeamIsNotNull(newTrainer);
    }

    async findAll(): Promise<Trainer[]> {
        const tmpList = await prisma.trainer.findMany({include: { activeTeam: true }});

        let trainers : Trainer[] = new Array();
        for(let i = 0 ; i < tmpList.length ; i++) {
            try {
                const elementWithoutNullFields = await TrainerRepository.createTrainerObjectIfActiveTeamIsNotNull(tmpList[i]);
                trainers.push(elementWithoutNullFields);
            } catch (error : any) {
                return error;
            }
        }

        return trainers;
    }

    async find(trainerId : number) : Promise<Trainer> {
        const trainer = await prisma.trainer.findUnique({
            where: {
                id: trainerId
            },
            include: { activeTeam: true },
        })
        if (trainer === null){
            return Promise.reject("Trainer not in DB.")
        }
        return TrainerRepository.createTrainerObjectIfActiveTeamIsNotNull(trainer);
    }
    async update(trainer: {id: number, name: string, gender: string }): Promise<Trainer>{
        const ret = await prisma.trainer.update({
            where:{
                id: trainer.id
            },
            data: {
                name: trainer.name,
                gender: trainer.gender,
            },
            include: { activeTeam: true },
        });
        return TrainerRepository.createTrainerObjectIfActiveTeamIsNotNull(ret);
    }
    async delete(trainerId : number): Promise<Trainer>{
        const ret = await prisma.trainer.delete({
            where:{
                id: trainerId
            },
            include: { activeTeam: true },
        });
        return TrainerRepository.createTrainerObjectIfActiveTeamIsNotNull(ret);
    }
    

}
