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
                attackingTrainerId:  battle.attackingTrainerId,
                opposingTrainerId:  battle.opposingTrainerId,
                attackerPokemonLifePoints:  battle.attackerPokemonLifePoints,
                opponentPokemonLifePoints:  battle.opponentPokemonLifePoints,
                winner:  battle.winner
            },
        });

        return newBattle;
    }

    async findAll(): Promise<Battle[]> {
        const battles: Battle[] = await prisma.battle.findMany();

        return battles;
    }
}
