import {IBattleRepository} from "../domain/interfaces";
import {Battle} from "../domain/entities";
import {prisma} from "../../db";


export class BattleRepository implements IBattleRepository {
    async create(battle: { attackingTrainerId: number,
                           opposingTrainerId: number,
                           attackerPokemonId : number,
                           opponentPokemonId : number,
                           winner: number }): Promise<Battle> {

        const newBattle = await prisma.battle.create({
            data : {
                attackingTrainerId:         battle.attackingTrainerId,
                opposingTrainerId:          battle.opposingTrainerId,
                attackerPokemonId :         battle.attackerPokemonId,
                opponentPokemonId :         battle.opponentPokemonId,
                winner:                     battle.winner
            },
        });

        return newBattle;
    }

    async findAll(): Promise<Battle[]> {
        const battles: Battle[] = await prisma.battle.findMany();
        return battles;
    }

    async find(battleId : number) : Promise<Battle> {
        const battle = await prisma.battle.findUnique({
            where: {
                id: battleId
            }
        })
        if (battle === null){
            return Promise.reject("Battle was not in DB")
        }
        return battle
    }
    
    async findActiveBattleWithTrainerId(trainerId : number) : Promise<Battle> {
        const battle = await prisma.battle.findFirst({
            where: {
                OR: [
                    { attackingTrainerId: trainerId},
                    {opposingTrainerId: trainerId,}
                ],
                AND: [
                    {winner: -1},
                ]
            }
        });
        if (battle === null){
            return Promise.reject("The battle does not exist or is already over.");
        }
        return battle
    }

    async update(battle: Battle): Promise<Battle>{
        const ret = await prisma.battle.update({
            where:{
                id: battle.id
            },
            data: {
                attackingTrainerId:         battle.attackingTrainerId,
                opposingTrainerId:          battle.opposingTrainerId,
                attackerPokemonId :         battle.attackerPokemonId,
                opponentPokemonId :         battle.opponentPokemonId,
                winner:                     battle.winner
            }
        });
        return ret;
    }

}
