import {IBattleRepository} from "../domain/interfaces";
import {Battle} from "../domain/entities";
import {prisma} from "../../db";


export class BattleRepository implements IBattleRepository {
    async create(battle: { attackingTrainerId: number,
                           opposingTrainerId: number,
                           attackerPokemonLifePoints: number,
                           opponentPokemonLifePoints: number,
                           winner: number }): Promise<Battle> {

        const newBattle = await prisma.battle.create({
            data: {
                attackingTrainerId:         battle.attackingTrainerId,
                opposingTrainerId:          battle.opposingTrainerId,
                attackerPokemonLifePoints:  battle.attackerPokemonLifePoints,
                opponentPokemonLifePoints:  battle.opponentPokemonLifePoints,
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
            return Promise.reject("Battle was not in DB or is finished.");
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
                attackerPokemonLifePoints:  battle.attackerPokemonLifePoints,
                opponentPokemonLifePoints:  battle.opponentPokemonLifePoints,
                winner:                     battle.winner
            }
        });
        return ret;
    }

}
