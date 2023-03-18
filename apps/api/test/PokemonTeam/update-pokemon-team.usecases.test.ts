import { describe, expect, expectTypeOf, test, beforeAll, afterEach, vi } from 'vitest';
import { Pokemon, Trainer, PokemonTeam, Item, Stats } from '../../src/domain/entities';
import { UpdatePokemonTeamUsecase } from "../../src/domain/PokemonTeam/update-pokemon-team.usecases";

export function createGivenPokemon(id : number) : Pokemon {
    const pokemon : Pokemon = {
        id: id,
        pokedex: 493,
        name: "arceus",
        stats: {attack:126, hp:126},
        moves: [{name:"jugement", damage:1000}],
        item: {itemId:1, name:"poireau", effect:0},
        exp: 10000,
        level: 10,
        types:[{name:"normal"}]
    };
    return pokemon;
};

function createGivenTrainer() : Trainer {
    const givenTrainerId = 88;
    const givenPokemonTeam: PokemonTeam = {
        teamId: 1,
        trainerId: givenTrainerId,
        //trainer: givenTrainer,
        pokemonList:[]
    };
    return {id:givenTrainerId, name: "test", gender: "f", activeTeam:givenPokemonTeam};
};

describe('Update PokemonTeam Usecase - test', () => {

    const givenUserId = 54;
    const givenPokemon : Pokemon = createGivenPokemon(12);
    const givenTrainer : Trainer = createGivenTrainer();

    const pokemonTeamRepositoryMock = {
        create: vi.fn(),
        findAll: vi.fn(),
        find : vi.fn(),
        addToTeam : vi.fn(),
        removeFromTeam : vi.fn(),
    }

    const pokemonRepositoryMock = {
        create: vi.fn(),
        findAll: vi.fn(),
        find: vi.fn(),
    }

    const updatePokemonTeamUsecase = new UpdatePokemonTeamUsecase(pokemonTeamRepositoryMock, pokemonRepositoryMock);

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('should add ', async () => {
        //GIVEN
        pokemonRepositoryMock.find.mockImplementation(() => givenPokemon);
        const givenPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:[]
        };
        pokemonTeamRepositoryMock.find.mockImplementation(()=> givenPokemonTeam);
        const expectedPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:[givenPokemon]
        };
        pokemonTeamRepositoryMock.addToTeam.mockImplementation(() => expectedPokemonTeam);
        

        //WHEN
        const team = await updatePokemonTeamUsecase.addPokemon(givenPokemonTeam.teamId, givenPokemon.id);

        //THEN
        expect(pokemonTeamRepositoryMock.addToTeam).toHaveBeenCalledOnce();
        expect(pokemonTeamRepositoryMock.find).toHaveBeenCalledOnce();
        expect(pokemonTeamRepositoryMock.addToTeam).toBeCalledWith(
            expectedPokemonTeam,
            givenPokemon.id
        );
        expect(expectedPokemonTeam).toStrictEqual(team);
    });

    test('should remove ', async () => {
        //GIVEN
        pokemonRepositoryMock.find.mockImplementation(() => givenPokemon);
        const givenPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:[givenPokemon]
        };
        pokemonTeamRepositoryMock.find.mockImplementation(()=> givenPokemonTeam);
        const expectedPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:[]
        };
        pokemonTeamRepositoryMock.removeFromTeam.mockImplementation(() => expectedPokemonTeam);
        
        //WHEN
        const team = await updatePokemonTeamUsecase.removePokemon(givenPokemonTeam.teamId, givenPokemon.id);

        //THEN
        expect(pokemonTeamRepositoryMock.removeFromTeam).toHaveBeenCalledOnce();
        expect(pokemonTeamRepositoryMock.find).toHaveBeenCalledOnce();
        expect(pokemonTeamRepositoryMock.removeFromTeam).toBeCalledWith(
            expectedPokemonTeam,
            givenPokemon.id
        );
        expect(expectedPokemonTeam).toStrictEqual(team);
    });

    test('should add not more than 6 pokemon', async () => {
        //GIVEN
        let givenPokemonList : Pokemon[] = []
        for (let index = 0; index < 6; index++) {
            const givenPokemon: Pokemon = createGivenPokemon(index + 1);
            givenPokemonList.push(givenPokemon);
        }
        pokemonRepositoryMock.find.mockImplementation(() => givenPokemon);
        const givenPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:givenPokemonList
        };
        pokemonTeamRepositoryMock.find.mockImplementation(()=> givenPokemonTeam);
        const expectedPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:givenPokemonList
        };
        pokemonTeamRepositoryMock.addToTeam.mockImplementation(() => expectedPokemonTeam);
        

        //WHEN
        await expect(()=> 
            updatePokemonTeamUsecase.addPokemon(givenPokemonTeam.teamId, givenPokemon.id)
        ).rejects.toThrowError("This team is full. Maximum 6 pokemons per team are allowed.");
        
        //THEN
        expect(pokemonTeamRepositoryMock.addToTeam).toHaveBeenCalledTimes(0);
        expect(pokemonTeamRepositoryMock.find).toHaveBeenCalledOnce();

    });

    test('should not add pokemon not in DB', async () => {
        //GIVEN
        pokemonRepositoryMock.find.mockImplementation(() => null);
        const givenPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:[]
        };
        pokemonTeamRepositoryMock.find.mockImplementation(()=> givenPokemonTeam);
        const expectedPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:[]
        };
        pokemonTeamRepositoryMock.addToTeam.mockImplementation(() => expectedPokemonTeam);


        //WHEN
        await expect(()=> 
            updatePokemonTeamUsecase.addPokemon(givenPokemonTeam.teamId, givenPokemon.id)
        ).rejects.toThrowError("Pokemon not found in DB");
        
        //THEN
        expect(pokemonTeamRepositoryMock.addToTeam).toHaveBeenCalledTimes(0);
        expect(pokemonTeamRepositoryMock.find).toHaveBeenCalledOnce();
    });

    test('should not remove pokemon not in DB', async () => {
        //GIVEN
        pokemonRepositoryMock.find.mockImplementation(() => undefined);
        const givenPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:[givenPokemon]
        };
        pokemonTeamRepositoryMock.find.mockImplementation(()=> givenPokemonTeam);
        const expectedPokemonTeam: PokemonTeam = {
            teamId: 1,
            trainerId: givenTrainer.id,
            //trainer: givenTrainer,
            pokemonList:[givenPokemon]
        };
        pokemonTeamRepositoryMock.removeFromTeam.mockImplementation(() => expectedPokemonTeam);
        
        //WHEN
        await expect(()=> 
            updatePokemonTeamUsecase.removePokemon(givenPokemonTeam.teamId, givenPokemon.id)
        ).rejects.toThrowError("Pokemon not found in DB");
        
        //THEN
        expect(pokemonTeamRepositoryMock.addToTeam).toHaveBeenCalledTimes(0);
        expect(pokemonTeamRepositoryMock.find).toHaveBeenCalledOnce();
    });
});