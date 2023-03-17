import {describe, expect, expectTypeOf, test, it } from 'vitest';
import {BattleRepository} from "../src/infrastructure/battle.repository";
import {initTrainerContainer} from "../src/domain/trainer.container";
import {initPokemonContainer} from "../src/domain/pokemon.container";
import {initPokemonTeamContainer} from "../src/domain/pokemon-team.container";
import {initUserContainer} from "../src/domain/user.container";

export async function generateAttackerAndOpponentForTest() : Promise<{ attackingTrainerId: number; opposingTrainerId: number; attackerPokemonId: number; opponentPokemonId: number; winner: number; }> {
    const trainerContainer = initTrainerContainer();

    const pokemonTeamContainer = initPokemonTeamContainer();
    const pokemonContainer = initPokemonContainer();
    const userContainer = initUserContainer()

    const givenPikachu1 : any = {
        pokedex: 25,
        name: 'pikachu',
        stats: { attack: 55, hp: 35 },
        item: {name: 'test', effect: 3 },
        moves: [
            { name: 'mega-punch', damage: 80 },
            { name: 'pay-day', damage: 40 }
        ],
        types:[{name:'electric'}],
        exp: 112,
        level: 0
    };

    const givenPikachu2 : any = {
        pokedex: 25,
        name: 'pikachu',
        stats: { attack: 55, hp: 35 },
        item: {name: 'test', effect: 3 },
        moves: [
            { name: 'mega-punch', damage: 80 },
            { name: 'pay-day', damage: 40 }
        ],
        types:[{name:'electric'}],
        exp: 112,
        level: 0
    };

    const newUser1 = await userContainer.createUserUsecase.execute({
        email : "test1_" + (new Date()).getMilliseconds() + "@test.test",
        pwd : "test1",
        name: "",
        inscriptionDate: new Date,
        AllMyPokemon: [],
    });

    const newUser2 = await userContainer.createUserUsecase.execute({
        email : "test2_" + (new Date()).getMilliseconds() + "@test.test",
        pwd : "test1",
        name: "",
        inscriptionDate: new Date,
        AllMyPokemon: [],
    });

    let attackingTrainer = await trainerContainer.createTrainerUsecase.execute({name: "testBattle1", gender: "m", userId : newUser1.id});
    let opposingTrainer = await trainerContainer.createTrainerUsecase.execute({name: "testBattle2", gender: "f", userId : newUser2.id});

    givenPikachu1.userId = newUser1.id as unknown as {"userId" : number};
    const givenPokemon1 = await pokemonContainer.createPokemonUsecase.execute(givenPikachu1);
    const givenAttackingUpdatedPokemonTeam = await pokemonTeamContainer.updatePokemonTeamUsecase.addPokemon(attackingTrainer.activeTeam.teamId, givenPokemon1.id);
    attackingTrainer.activeTeam = givenAttackingUpdatedPokemonTeam;

    givenPikachu2.userId = newUser2.id as unknown as {"userId" : number};
    const givenPokemon2 = await pokemonContainer.createPokemonUsecase.execute(givenPikachu2);
    const givenOpposingUpdatedPokemonTeam = await pokemonTeamContainer.updatePokemonTeamUsecase.addPokemon(opposingTrainer.activeTeam.teamId, givenPokemon2.id);
    opposingTrainer.activeTeam = givenOpposingUpdatedPokemonTeam;
    
    const attackerPokemonId = attackingTrainer.activeTeam.pokemonList[0].id;
    const opponentPokemonId = opposingTrainer.activeTeam.pokemonList[0].id;

    return {attackingTrainerId:  attackingTrainer.id,
            opposingTrainerId: opposingTrainer.id,
            attackerPokemonId: attackerPokemonId,
            opponentPokemonId: opponentPokemonId,
            winner: -1 };
};

describe('Battle Repository - test', () => {
    const battleRepository = new BattleRepository()

    test('#create', async () => {
        const {attackingTrainerId, opposingTrainerId, attackerPokemonId, opponentPokemonId, winner} = await generateAttackerAndOpponentForTest();

        // WHEN
        const battle = await battleRepository.create({attackingTrainerId, opposingTrainerId, attackerPokemonId, opponentPokemonId, winner})

        // THEN
        expectTypeOf(battle.id).toBeNumber();
        expect(battle.attackingTrainerId).toEqual(attackingTrainerId);
        expect(battle.opposingTrainerId).toEqual(opposingTrainerId);
        expect(battle.attackerPokemonId).toEqual(attackerPokemonId);
        expect(battle.opponentPokemonId).toEqual(opponentPokemonId);
        expect(battle.winner).toEqual(winner);
    });
});
