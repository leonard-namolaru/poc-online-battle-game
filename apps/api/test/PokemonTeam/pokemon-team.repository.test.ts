import { describe, expect, expectTypeOf, test, beforeEach, afterEach } from 'vitest';
import { PokemonTeamRepository } from "../../src/infrastructure/pokemon-team.repository";
import { initTrainerContainer } from "../../src/domain/Trainer/trainer.container";
import { initPokemonContainer } from "../../src/domain/Pokemon/pokemon.container";
import { initUserContainer } from "../../src/domain/User/user.container";
import { PokeApiRepository } from "../../src/infrastructure/poke-api.repository"
import { Trainer, Item, Stats, User, Pokemon } from '../../src/domain/entities';
import { createGivenPokemon } from "./update-pokemon-team.usecases.test"

describe('PokemonTeam Repository - test', () => {
    const trainerContainer = initTrainerContainer();
    const pokemonContainer = initPokemonContainer();
    const userContainer = initUserContainer();
    const pokemonTeamRepository = new PokemonTeamRepository();
    const pokeApi = new PokeApiRepository();
    let givenUser: User;
    let givenTrainer: Trainer;
    let teamId = 0;

    beforeEach(async () => {
        givenUser = await userContainer.createUserUsecase.execute({
            name: "testUserpokemonTeam",
            email:"test@testmail.fr",
            inscriptionDate: new Date(Date.now()),
            pwd:"test",
            AllMyPokemon:[]
        });

        givenTrainer = await trainerContainer.createTrainerUsecase.execute({
            name: "TotoTeam", gender: "f", userId: givenUser.id
        });

        const givenTortipouss : Pokemon = createGivenPokemon(123);
        const givenMoves = givenTortipouss.moves;
        const givenStats : Stats = givenTortipouss.stats;
        const givenItem : Item = {itemId: 1, name: "Pépite", effect:0};

        await pokemonContainer.createPokemonUsecase.execute({pokedex:387, name:"Tortipouss", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:givenUser.id, types:[{name:"grass"}]});    
        await pokemonContainer.createPokemonUsecase.execute({pokedex:390, name:"Ouisticram", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:givenUser.id, types:[{name:"fire"}]});    
        await pokemonContainer.createPokemonUsecase.execute({pokedex:393, name:"Tiplouf", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:givenUser.id, types:[{name:"water"}]});    
        await pokemonContainer.createPokemonUsecase.execute({pokedex:396, name:"Etourmi", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:givenUser.id, types:[{name:"flying"}]});    
        await pokemonContainer.createPokemonUsecase.execute({pokedex:399, name:"Keunotor", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:givenUser.id, types:[{name:"normal"}]});    
        await pokemonContainer.createPokemonUsecase.execute({pokedex:403, name:"Lixy", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:givenUser.id, types:[{name:"electric"}]});    
    });

    afterEach(async () => {
        await userContainer.deleteUserUsecase.execute({userId: givenUser.id});
    });

    test('#create', async () => {
        // GIVEN

        // WHEN
        //const team = await pokemonTeamRepository.create(givenTrainer.id);

        // THEN
        /*expectTypeOf(team.teamId).toBeNumber();
        expectTypeOf(team.trainerId).toBeNumber();
        //expectTypeOf(team.trainer).toEqualTypeOf(givenTrainer);
        //expect(team.trainer).toEqual(givenTrainer);
        expect(team.pokemonList).toEqual([]);*/
        
        // Problème, car le usecase de création des Trainers créer déjà une équipe.
        expectTypeOf(givenTrainer.activeTeam.teamId).toBeNumber();
        expectTypeOf(givenTrainer.activeTeam.trainerId).toBeNumber();
        expect(givenTrainer.activeTeam.pokemonList).toEqual([]);
    });

    test('#find', async () => {
        // GIVEN
        const givenTeamId = givenTrainer.activeTeam.teamId;

        // WHEN
        const team = await pokemonTeamRepository.find(givenTeamId);

        // THEN
        expectTypeOf(team.teamId).toBeNumber();
        expect(team.teamId).toEqual(givenTeamId);
    });

    test('#addToTeam', async () => {
        // GIVEN
        const givenTeamId = givenTrainer.activeTeam.teamId;
        const pokemons = await pokemonContainer.getAllPokemonsUsecase.execute(givenUser.id);
        const givenPokemon : Pokemon = pokemons[0];
        
        // WHEN
        const team = await pokemonTeamRepository.find(givenTeamId);
        const modfiedTeam = await pokemonTeamRepository.addToTeam(team, givenPokemon.id);

        // THEN
        expect(modfiedTeam.teamId).toEqual(givenTeamId);
        if(modfiedTeam.pokemonList != null){
            expect(modfiedTeam.pokemonList.length).toEqual(1);
        }
        expect(modfiedTeam.pokemonList).toEqual([givenPokemon]);

    });

    test('#removeFromTeam', async () => {
        // GIVEN
        const givenTeamId = givenTrainer.activeTeam.teamId;
        const pokemons = await pokemonContainer.getAllPokemonsUsecase.execute(givenUser.id);
        const givenPokemon = pokemons[0];
        pokemonTeamRepository.addToTeam(givenTrainer.activeTeam, givenPokemon.id);
        
        // WHEN
        const team = await pokemonTeamRepository.find(givenTeamId);
        const modfiedTeam = await pokemonTeamRepository.removeFromTeam(team, givenPokemon.id);

        // THEN
        expect(modfiedTeam.teamId).toEqual(givenTeamId);
        if(modfiedTeam.pokemonList != null){
            expect(modfiedTeam.pokemonList.length).toEqual(0);
        }
        expect(modfiedTeam.pokemonList).toEqual([]);

    });

    test('#addAndRemoveMultiple', async () => {
        // GIVEN
        const givenTeamId = givenTrainer.activeTeam.teamId;
        const givenPokemons = await pokemonContainer.getAllPokemonsUsecase.execute(givenUser.id);
        console.log(givenPokemons);
        // WHEN
        const team = await pokemonTeamRepository.find(givenTeamId);
        let modfiedTeam = await pokemonTeamRepository.addToTeam(team, givenPokemons[2].id);
        modfiedTeam = await pokemonTeamRepository.addToTeam(team, givenPokemons[4].id);

        // THEN
        expect(modfiedTeam.teamId).toEqual(givenTeamId);
        if(modfiedTeam.pokemonList != null){
            expect(modfiedTeam.pokemonList.length).toEqual(2);
        }
        expect(modfiedTeam.pokemonList).toEqual([givenPokemons[2], givenPokemons[4]]);

        // WHEN
        modfiedTeam = await pokemonTeamRepository.removeFromTeam(team, givenPokemons[4].id);

        // THEN
        expect(modfiedTeam.teamId).toEqual(givenTeamId);
        if(modfiedTeam.pokemonList != null){
            expect(modfiedTeam.pokemonList.length).toEqual(1);
        }
        expect(modfiedTeam.pokemonList).toEqual([givenPokemons[2]]);

    });
})